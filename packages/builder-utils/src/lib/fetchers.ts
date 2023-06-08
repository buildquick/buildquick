import {
  ContentItemV3,
  ContentApiOptions,
  ContentApiResponseV3,
} from '@buildquick/builder-types';
import { backoff } from './backoff';
import { QueryString } from '@builder.io/sdk/dist/src/classes/query-string.class';

type ValidateShape<T, Shape> = T extends Shape
  ? Exclude<keyof T, keyof Shape> extends never
    ? T
    : never
  : never;

type Transform<T> = ({ data }: { data: ContentApiResponseV3 }) => Promise<T>;

type ContentFetcherOptions<T> = ContentApiOptions & {
  model: string;
  transform?: Transform<T>;
  maxBackoff?: number;
  maxTries?: number;
  authToken?: `bpk-${string}`;
  fetchOptions?: RequestInit;
  getContentApiUrl?: ({
    model,
    query,
    queryString,
    authToken,
  }: {
    model: string;
    query: ContentApiOptions;
    queryString: string;
    authToken?: `bpk-${string}`;
  }) => Promise<string>;
};

type ContentFetcher<T, O = ContentFetcherOptions<T>> = (
  options: O
) => Promise<T>;

type GetAllOptions = Omit<
  ContentFetcherOptions<ContentItemV3[]>,
  'limit' | 'transform'
> & {
  pageLimit?: number;
  pageTransform?: ({
    data,
    pageIndex,
    offset,
    limit,
  }: {
    data: ContentApiResponseV3;
    pageIndex: number;
    offset: number;
    limit: number;
  }) => Promise<ContentItemV3[]>;
};

// Max limit supported by Builder content API is 100.
const BUILDER_MAX_LIMIT = 100;

export const createContentApiV3Url = async (
  options: ContentApiOptions &
    Pick<
      ContentFetcherOptions<never>,
      'model' | 'getContentApiUrl' | 'authToken'
    >
) => {
  const apiOptions = getApiOptions(options);
  const query = QueryString.stringifyDeep(apiOptions);
  let url = `https://cdn.builder.io/api/v3/content/${options.model}?${query}`;

  // Override the default content API URL (for example, when proxying the content API).
  if (options.getContentApiUrl) {
    const urlOptions: Parameters<
      Exclude<ContentFetcherOptions<never>['getContentApiUrl'], undefined>
    >[0] = {
      model: options.model,
      query: apiOptions,
      queryString: query,
    };

    if (options.authToken) urlOptions.authToken = options.authToken;

    url = await options.getContentApiUrl(urlOptions);
  }

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
    'data',
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

  return validOptions;
};

const get: ContentFetcher<
  ContentApiResponseV3,
  ContentFetcherOptions<ContentItemV3 | ContentItemV3[]>
> = async (options) => {
  const url = await createContentApiV3Url(options);
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
  const data: ContentApiResponseV3 = await res.json();

  return data || null;
};

export const getOne: ContentFetcher<ContentItemV3> = async (options) => {
  const defaultTransform: Transform<ContentItemV3> = async ({ data }) =>
    data.results[0];
  const transform = options.transform ?? defaultTransform;
  const execute = async () => {
    const data = await get(options);

    return await transform({ data });
  };

  return await backoff(execute, options.maxBackoff, options.maxTries);
};

export const getSome: ContentFetcher<ContentItemV3[]> = async (options) => {
  const defaultTransform: Transform<ContentItemV3[]> = async ({ data }) =>
    data.results;
  const transform = options.transform ?? defaultTransform;
  const execute = async () => {
    const data = await get(options);

    return await transform({ data });
  };

  return await backoff(execute, options.maxBackoff, options.maxTries);
};

export const getAll: ContentFetcher<ContentItemV3[], GetAllOptions> = async (
  options
) => {
  const pageLimit = options.pageLimit || BUILDER_MAX_LIMIT;
  const defaultPageTransform: GetAllOptions['pageTransform'] = async ({
    data,
  }) => data.results;
  const pageTransform = options.pageTransform || defaultPageTransform;
  let offset = 0;
  let nextItems: Promise<ContentItemV3[] | null>;
  let allItems: (typeof nextItems)[] = [];
  let pageIndex = 0;
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
      const data = await get(batchOptions);
      const { results } = data;

      // Neither of these should ever happen.
      if (!results)
        throw new Error('Content API unexpectedly returned nothing.');
      if (results.length > pageLimit)
        throw new Error('Content API returned more items than the limit.');

      nextItems = pageTransform({
        data,
        pageIndex,
        offset,
        limit: pageLimit,
      });
      allItems = (allItems || []).concat(nextItems);
    };

    // Retry fetching the content with an with exponential delay until we reach the
    // maximum number of retries.
    await backoff(fetchContent, options.maxBackoff, options.maxTries);
    offset += pageLimit;
    pageIndex++;
  } while (allItems.length === pageLimit);

  // Ensure that all transformations have been applied.
  return (await Promise.all(allItems))
    .flat()
    .filter<ContentItemV3>((item): item is ContentItemV3 => !!item);
};

export const getUrlPathsFromContentItem = (content: ContentItemV3) => {
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
