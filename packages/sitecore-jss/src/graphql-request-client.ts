import { GraphQLRequestClientConfig, GraphQLRequestClient } from '@sitecore-jss/sitecore-jss';

import {
  GraphQLRequestClientFactoryConfig,
  GraphQLRequestClientFactory,
} from './graphql-request-client-factory';

declare module '@sitecore-jss/sitecore-jss' {
  class GraphQLRequestClient {
    static createClientFactory({
      endpoint,
      apiKey,
    }: GraphQLRequestClientFactoryConfig): GraphQLRequestClientFactory;
  }
}

/**
 * Factory method for creating a GraphQLRequestClientFactory.
 * @param {Object} config - client configuration options.
 * @param {string} config.endpoint - endpoint
 * @param {string} [config.apiKey] - apikey
 */
GraphQLRequestClient.createClientFactory = ({
  endpoint,
  apiKey,
}: GraphQLRequestClientFactoryConfig): GraphQLRequestClientFactory => {
  return (config: Omit<GraphQLRequestClientConfig, 'apiKey'> = {}) =>
    new GraphQLRequestClient(endpoint, { ...config, apiKey });
};
