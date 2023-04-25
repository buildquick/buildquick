import {
  ContentItemV2,
  ContentApiOptions,
  ContentApiResponseV2,
} from '@buildquick/builder-types';
import { backoff } from './backoff';
import { QueryString } from '@builder.io/sdk/dist/src/classes/query-string.class';

type ValidateShape<T, Shape> = T extends Shape
  ? Exclude<keyof T, keyof Shape> extends never
    ? T
    : never
  : never;

type Transform<T> = (results: ContentItemV2[]) => Promise<T>;

type ContentFetcherOptions<T> = ContentApiOptions & {
  model: string;
  transform?: Transform<T>;
  maxBackoff?: number;
  maxTries?: number;
  authToken?: `bpk-${string}`;
  fetchOptions?: RequestInit;
};

type ContentFetcher<T, O = ContentFetcherOptions<T>> = (
  options: O
) => Promise<T>;

type GetAllOptions = Omit<
  ContentFetcherOptions<ContentItemV2[]>,
  'limit' | 'transform'
> & {
  pageLimit?: number;
  pageTransform?: (
    content: ContentItemV2[],
    page: number
  ) => Promise<ContentItemV2[]>;
};

// Max limit supported by Builder content API is 100.
const BUILDER_MAX_LIMIT = 100;

export const createContentApiV2Url = (
  options: ContentApiOptions & Pick<ContentFetcherOptions<never>, 'model'>
) => {
  const apiOptions = getApiOptions(options);
  const query = QueryString.stringifyDeep(apiOptions);
  const url = `https://cdn.builder.io/api/v2/content/${options.model}?${query}`;

  return url;
};

const isString = (str: unknown): str is string =>
  Object.prototype.toString.call(str) === '[object String]';

const getApiOptions = <T>(
  options: Record<string, unknown>
): ValidateShape<T, ContentApiOptions> => {
  type RequiredProperties = keyof typeof requiredProperties;

  // NOTE: Keep this in sync with the content API options type.
  const requiredProperties = { apiKey: isString };
  // NOTE: Keep this in sync with the content API options type.
  const expectedProperties = [
    ...Object.keys(requiredProperties),
    'userAttributes',
    'url',
    'includeUrl',
    'includeRefs',
    'cacheSeconds',
    'staleCacheSeconds',
    'limit',
    'query',
    'cachebust',
    'prerender',
    'extractCss',
    'offset',
    'cache',
    'locale',
    'entry',
    'alias',
    'fields',
    'omit',
    'key',
    'format',
    'noWrap',
    'rev',
    'static',
    'noTraverse',
    'noTargeting',
    'includeUnpublished',
    'sort',
  ];

  const isValidRequiredProp = (prop: RequiredProperties) =>
    Object.keys(options).includes(prop) &&
    requiredProperties[prop](options[prop]);

  const doesOptionsHaveRequiredProperties = (
    options: Record<string, unknown>
  ): options is Pick<ContentApiOptions, RequiredProperties> &
    Record<string, unknown> =>
    (Object.keys(requiredProperties) as RequiredProperties[]).every(
      isValidRequiredProp
    );

  const isValidOptionsProp = (prop: string): prop is keyof ContentApiOptions =>
    expectedProperties.includes(prop);

  if (!doesOptionsHaveRequiredProperties(options)) {
    const invalidRequiredProps = Object.keys(requiredProperties).filter(
      (prop) => !isValidOptionsProp(prop)
    );
    const msg = invalidRequiredProps
      .map((prop) => `${prop} (value: ${options[prop]})`)
      .join(', ');

    throw new Error(
      `Required props missing from options or have invalid values: ${msg}. Check your content API options parameter.`
    );
  }

  const validOptions = Object.keys(options).reduce<ContentApiOptions>(
    (acc, prop) => {
      if (isValidOptionsProp(prop)) {
        const value = options[prop];

        Object.assign(acc, { [prop]: value });
      }

      return acc;
    },
    { apiKey: options.apiKey }
  ) as ValidateShape<T, ContentApiOptions>;

  return {
    noTraverse: false,
    includeRefs: true,
    ...validOptions,
  };
};

const get: ContentFetcher<
  ContentItemV2[],
  ContentFetcherOptions<ContentItemV2 | ContentItemV2[]>
> = async (options) => {
  const url = createContentApiV2Url(options);
  const init = options.fetchOptions ?? {};

  if (
    options.authToken &&
    !(init.headers as Record<string, string> | undefined)?.['Authorization']
  ) {
    init.headers ||= {};
    Object.assign(init.headers, {
      Authorization: `Bearer ${options.authToken}`,
    });
  }

  const res = await fetch(url, init);
  const data: ContentApiResponseV2 = await res.json();

  return data?.results || null;
};

export const getOne: ContentFetcher<ContentItemV2> = async (options) => {
  const defaultTransform: Transform<ContentItemV2> = async (results) =>
    results[0];
  const transform = options.transform ?? defaultTransform;
  const execute = async () => {
    const results = await get(options);

    return await transform(results);
  };

  return await backoff(execute, options.maxBackoff, options.maxTries);
};

export const getSome: ContentFetcher<ContentItemV2[]> = async (options) => {
  const defaultTransform: Transform<ContentItemV2[]> = async (results) =>
    results;
  const transform = options.transform ?? defaultTransform;
  const execute = async () => {
    const results = await get(options);

    return await transform(results);
  };

  return await backoff(execute, options.maxBackoff, options.maxTries);
};

export const getAll: ContentFetcher<ContentItemV2[], GetAllOptions> = async (
  options
) => {
  const pageLimit = options.pageLimit || BUILDER_MAX_LIMIT;
  const defaultPageTransform: Transform<ContentItemV2[]> = async (results) =>
    results;
  const pageTransform = options.pageTransform || defaultPageTransform;
  let offset = 0;
  let nextItems: Promise<ContentItemV2[] | null>;
  let allItems: (typeof nextItems)[] = [];
  let page = 0;
  let fetchContent;

  do {
    // Reassign with a new closure for each page of results.
    fetchContent = async () => {
      const batchOptions = Object.assign(
        {
          limit: pageLimit,
          offset,
        },
        options
      );
      const results = await get(batchOptions);

      // Neither of these should ever happen.
      if (!results)
        throw new Error('Content API unexpectedly returned nothing.');
      if (results.length > pageLimit)
        throw new Error('Content API returned more items than the limit.');

      nextItems = pageTransform(results, page);
      allItems = (allItems || []).concat(nextItems);
    };

    // Retry fetching the content with an with exponential delay until we reach the
    // maximum number of retries.
    await backoff(fetchContent, options.maxBackoff, options.maxTries);
    offset += pageLimit;
    page++;
  } while (allItems.length === pageLimit);

  // Ensure that all transformations have been applied.
  return (await Promise.all(allItems))
    .flat()
    .filter<ContentItemV2>((item): item is ContentItemV2 => !!item);
};

export const getUrlPathsFromContentItem = (content: ContentItemV2) => {
  if (Array.isArray(content.data.url)) return content.data.url;
  return [content.data.url];
};

export const getUrlPathsForModel = async ({
  model,
  apiKey,
}: {
  model: string;
  apiKey: string;
}) =>
  (
    await getAll({
      model,
      apiKey,
      fields: 'data.url',
      noTargeting: true,
    })
  )
    .map((content) => getUrlPathsFromContentItem(content))
    .flat();
