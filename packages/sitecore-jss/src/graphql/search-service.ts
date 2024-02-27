import { DocumentNode } from 'graphql';
import { GraphQLClient } from '@sitecore-jss/sitecore-jss';

/**
 * Data needed to paginate results
 */
export interface PageInfo {
  /**
   * string token that can be used to fetch the next page of results
   */
  endCursor: string;
  /**
   * a value that indicates whether more pages of results are available
   */
  hasNext: boolean;
}

/**
 * Schema of data returned in response to a "search" query request
 * @template T The type of objects being requested.
 */
export type SearchQueryResult<T> = {
  search: {
    /**
     * Data needed to paginate the search results
     */
    pageInfo: PageInfo;
    /*
     * the type of data querying about items matching the search criteria
     */
    results: T[];
  };
};

/**
 * Describes the variables used by the 'search' query. Language should always be specified.
 * The other predicates are optional.
 */
export interface SearchQueryVariables {
  [key: string]: unknown;

  /** common variable for all GraphQL queries
   * it will be used for every type of query to regulate result batch size
   * Optional. How many result items to fetch in each GraphQL call. This is needed for pagination.
   * @default 10
   */
  pageSize?: number;
}

/**
 * Provides functionality for performing GraphQL 'search' operations, including handling pagination.
 * This class is meant to be extended or used as a mixin; it's not meant to be used directly.
 * @template T The type of objects being requested.
 * @mixin
 */
export class SearchQueryService<T> {
  /**
   * Creates an instance of search query service.
   * @param {GraphQLClient} client that fetches data from a GraphQL endpoint.
   */
  constructor(protected client: GraphQLClient) {}

  /**
   * 1. Validates mandatory search query arguments
   * 2. Executes search query with pagination
   * 3. Aggregates pagination results into a single result-set.
   * @template T The type of objects being requested.
   * @param {string | DocumentNode} query the search query.
   * @param {SearchQueryVariables} args search query arguments.
   * @returns {T[]} array of result objects.
   * @throws {RangeError} if a valid root item ID is not provided.
   * @throws {RangeError} if the provided language(s) is(are) not valid.
   */
  async fetch(query: string | DocumentNode, args: SearchQueryVariables): Promise<T[]> {
    let results: T[] = [];
    let hasNext = true;
    let after = '';

    while (hasNext) {
      const fetchResponse = await this.client.request<SearchQueryResult<T>>(query, {
        ...args,
        after,
      });

      results = results.concat(fetchResponse?.search?.results);
      hasNext = fetchResponse.search.pageInfo.hasNext;
      after = fetchResponse.search.pageInfo.endCursor;
    }

    return results;
  }
}
