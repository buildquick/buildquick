import { UserAttributes } from '@builder.io/sdk/dist/src/builder.class';

// Adapted from Builder SDK's GetContentOptions
export type ContentApiOptions = {
  apiKey: string;
  /**
   * User attribute key value pairs to be used for targeting
   * https://www.builder.io/c/docs/custom-targeting-attributes
   *
   * e.g.
   * ```js
   * userAttributes: {
   *   urlPath: '/',
   *   returnVisitor: true,
   * }
   * ```
   */
  userAttributes?: UserAttributes;
  /**
   * Alias for userAttributes.urlPath except it can handle a full URL (optionally with host,
   * protocol, query, etc) and we will parse out the path.
   */
  url?: string;
  /**
   * @package
   */
  includeUrl?: boolean;
  /**
   * Follow references. If you use the `reference` field to pull in other content without this
   * enabled we will not fetch that content for the final response.
   */
  includeRefs?: boolean;
  /**
   * How long in seconds content should be cached for. Sets the max-age of the cache-control header
   * response header.
   *
   * Use a higher value for better performance, lower for content that will change more frequently
   *
   * @see {@link https://www.builder.io/c/docs/query-api#__next:~:text=%26includeRefs%3Dtrue-,cacheSeconds,-No}
   */
  cacheSeconds?: number;
  /**
   * Builder.io uses stale-while-revalidate caching at the CDN level. This means we always serve
   * from edge cache and update caches in the background for maximum possible performance. This also
   * means that the more frequently content is requested, the more fresh it will be. The longest we
   * will ever hold something in stale cache is 1 day by default, and you can set this to be shorter
   * yourself as well. We suggest keeping this high unless you have content that must change rapidly
   * and gets very little traffic.
   *
   * @see {@link https://www.fastly.com/blog/prevent-application-network-instability-serve-stale-content}
   */
  staleCacheSeconds?: number;
  /**
   * Maximum number of results to return. Defaults to `1`.
   */
  limit?: number;
  /**
   * Mongodb style query of your data. E.g.:
   *
   * ```js
   * query: {
   *  id: 'abc123',
   *  data: {
   *    myCustomField: { $gt: 20 },
   *  }
   * }
   * ```
   *
   * See more info on MongoDB's query operators and format.
   *
   * @see {@link https://docs.mongodb.com/manual/reference/operator/query/}
   */
  query?: Record<string, object | string | number>;
  /**
   * Bust through all caches. Not recommended for production (for performance),
   * but can be useful for development and static builds (so the static site has
   * fully fresh / up to date content)
   */
  cachebust?: boolean;
  /**
   * Convert any visual builder content to HTML.
   *
   * This will be on data.html of the response's content entry object json.
   */
  prerender?: boolean;
  /**
   * Extract any styles to a separate css property when generating HTML.
   */
  extractCss?: boolean;
  /**
   * Pagination results offset. Defaults to zero.
   */
  offset?: number;
  /**
   * The name of the model to fetch content for.
   */
  model?: string;
  /**
   * Set to `false` to not cache responses when running on the client.
   */
  cache?: boolean;
  /**
   * Set to the current locale in your application if you want localized inputs to be auto-resolved, should match one of the locales keys in your space settings
   * Learn more about adding or removing locales [here](https://www.builder.io/c/docs/add-remove-locales)
   */
  locale?: string;
  /**
   * Specific content entry ID to fetch.
   */
  entry?: string;
  /**
   * @package
   * @deprecated
   * @hidden
   */
  alias?: string;
  fields?: string;
  /**
   * Omit only these fields.
   *
   * @example
   * ```
   * &omit=data.bigField,data.blocks
   * ```
   */
  omit?: string;
  key?: string;
  /**
   * @package
   *
   * Affects HTML generation for specific targets.
   */
  format?: 'amp' | 'email' | 'html' | 'react' | 'solid';
  /**
   * @deprecated
   * @hidden
   */
  noWrap?: true;
  /**
   * Specific string to use for cache busting. e.g. every time we generate
   * HTML we generate a rev (a revision ID) and we send that with each request
   * on the client, such that if we generate new server HTML we get a new rev
   * and we use that to bust the cache because even though the content ID may
   * be the same, it could be an updated version of this content that needs to
   * be fresh.
   */
  rev?: string;
  /**
   * Tell the API that when generating HTML to generate it in static mode for
   * a/b tests instead of the older way we did this
   */
  static?: boolean;
  noTraverse?: boolean;
  noTargeting?: boolean;
  includeUnpublished?: boolean;
  sort?: Record<string, object | string | number>;
};
