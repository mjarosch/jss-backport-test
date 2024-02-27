import { GraphQLRequestClientConfig, GraphQLRequestClient } from '@sitecore-jss/sitecore-jss';

/**
 * A GraphQL Client Factory is a function that accepts configuration and returns an instance of a GraphQLRequestClient.
 * This factory function is used to create and configure GraphQL clients for making GraphQL API requests.
 * @param config - The configuration object that specifies how the GraphQL client should be set up.
 * @returns An instance of a GraphQL Request Client ready to send GraphQL requests.
 */
export type GraphQLRequestClientFactory = (
  config: Omit<GraphQLRequestClientConfig, 'apiKey'>
) => GraphQLRequestClient;

/**
 * Configuration type for @type GraphQLRequestClientFactory
 */
export type GraphQLRequestClientFactoryConfig = {
  endpoint: string;
  apiKey?: string;
};
