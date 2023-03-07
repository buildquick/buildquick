import {
  ContentApiV2Item,
  ContentApiV2Options,
  ContentApiV2Response,
  ContentItem,
} from '@buildquick/builder-types';
import { QueryString } from '@builder.io/sdk/dist/src/classes/query-string.class';

type ValidateShape<T, Shape> = T extends Shape
  ? Exclude<keyof T, keyof Shape> extends never
    ? T
    : never
  : never;

type Transform<T> = (results: ContentItem[]) => Promise<T>;

type ContentFetcherOptions<T> = ContentApiV2Options & {
  transform?: Transform<T>;
  maxBackoff?: number;
  maxTries?: number;
};

type ContentFetcher<T, O = ContentFetcherOptions<T>> = (
  modelName: string,
  options: O
) => Promise<T | null>;

type GetAllOptions = Omit<
  ContentFetcherOptions<ContentApiV2Item[]>,
  'limit' | 'transform'
> & {
  pageLimit?: number;
  pageTransform?: (
    content: ContentApiV2Item[],
    page: number
  ) => Promise<ContentApiV2Item[]>;
};

// Max limit supported by Builder content API is 100.
const BUILDER_MAX_LIMIT = 100;

const createContentApiUrl = <T>(
  modelName: string,
  options: ValidateShape<T, ContentApiV2Options>
) => {
  const query = QueryString.stringifyDeep(options);
  const url = `https://cdn.builder.io/api/v2/content/${modelName}?${query}`;

  return url;
};

const getFinalOptions = (
  options: Record<string, unknown>
): ContentApiV2Options => {
  const expectedProperties = [
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
    'model',
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
  ];

  const isValidOptionsProp = (
    prop: string
  ): prop is keyof ContentApiV2Options => expectedProperties.includes(prop);

  const validOptions = Object.keys(options).reduce<ContentApiV2Options>(
    (acc, prop) => {
      if (isValidOptionsProp(prop)) {
        const value = options[prop];

        Object.assign(acc, { [prop]: value });
      }

      return acc;
    },
    {}
  );

  return {
    // Include shared content API options here.
    noTraverse: true,
    includeRefs: false,
    ...validOptions,
  };
};

const backoff = async (
  callback: () => Promise<void>,
  maxBackoff = 32000,
  maxTries = 6
) => {
  let jitter: number;
  let retryDelay: number;

  for (let count = 0; count < maxTries; count++) {
    jitter = Math.ceil(Math.random() * 1000);
    retryDelay = Math.min(2 ^ (count + jitter), maxBackoff);

    try {
      // Attempt to execute the callback.
      await callback();

      // Break on success.
      break;
    } catch (err) {
      // If we've thrown an error on the last iteration, don't ignore, re-throw.
      if (count + 1 >= maxTries) {
        throw new Error(
          `Attempt ${
            count + 1
          } of ${maxTries} failed. Max tries has been reached.\n\n${err}`
        );
      }
      // Otherwise, ignore the error, introduce a delay, and loop over again
      // to retry the fetch.
      if (process.env['DEBUG'])
        console.log(`Attempt ${count + 1} of ${maxTries} failed. Retrying...`);

      await new Promise<void>((resolve) =>
        setTimeout(() => resolve(), retryDelay)
      );
    }
  }
};

const get = async <T>(
  modelName: string,
  options: ValidateShape<T, ContentApiV2Options>
) => {
  const finalOptions = getFinalOptions(options);
  const url = createContentApiUrl(modelName, finalOptions);
  const res = await fetch(url);
  const data: ContentApiV2Response = await res.json();

  return data?.results || null;
};

export const getOne: ContentFetcher<ContentApiV2Item> = async (
  modelName,
  options
) => {
  const defaultTransform = async (results: ContentApiV2Item[]) => results[0];
  const transform = options.transform ?? defaultTransform;
  let result: ContentApiV2Item | null = null;
  const execute = async () => {
    const results = await get(modelName, getFinalOptions(options));

    result = await transform(results);
  };

  await backoff(execute, options.maxBackoff, options.maxTries);

  return result;
};

export const getSome: ContentFetcher<ContentApiV2Item[]> = async (
  modelName,
  options
) => {
  const defaultTransform = async (results: ContentApiV2Item[]) => results;
  const transform = options.transform ?? defaultTransform;
  let results: ContentApiV2Item[] = [];
  const execute = async () => {
    results = await get(modelName, getFinalOptions(options));
    results = await transform(results);
  };

  await backoff(execute, options.maxBackoff, options.maxTries);

  return results;
};

export const getAll: ContentFetcher<ContentApiV2Item[], GetAllOptions> = async (
  modelName,
  options
) => {
  const pageLimit = options.pageLimit || BUILDER_MAX_LIMIT;
  const defaultPageTransform: Transform<ContentApiV2Item[]> = async (results) =>
    results;
  const pageTransform = options.pageTransform || defaultPageTransform;
  let offset = 0;
  let nextItems: Promise<ContentApiV2Item[]>;
  let allItems: (typeof nextItems)[] | null = [];
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
      const results = await get(modelName, getFinalOptions(batchOptions));

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
  return allItems.length ? (await Promise.all(allItems)).flat() : null;
};
