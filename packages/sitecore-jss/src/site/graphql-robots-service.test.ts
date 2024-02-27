import { expect } from 'chai';
import nock from 'nock';
import { GraphQLRobotsService } from './graphql-robots-service';
import { siteNameError } from '../constants';
import { GraphQLRequestClient } from '@sitecore-jss/sitecore-jss';
import '../graphql-request-client';

describe('GraphQLRobotsService', () => {
  const endpoint = 'http://site';
  const apiKey = 'some-api-key';
  const siteName = 'site-name';

  afterEach(() => {
    nock.cleanAll();
  });

  const mockRobotsRequest = (siteName?: string) => {
    nock(endpoint)
      .post('/')
      .reply(
        200,
        siteName
          ? {
              data: {
                search: {
                  total: 1,
                  pageInfo: {
                    hasNext: false,
                    endCursor: '123',
                  },
                  results: [
                    {
                      siteGrouping: {
                        siteSettings: {
                          robots: {
                            value: siteName,
                          },
                        },
                      },
                    },
                  ],
                },
              },
            }
          : {
              data: {
                search: {
                  total: 0,
                  pageInfo: {
                    hasNext: false,
                    endCursor: '123',
                  },
                  results: [],
                },
              },
            }
      );
  };

  describe('Fetch robots.txt', () => {
    it('should get error if robots.txt has empty sitename', async () => {
      mockRobotsRequest();

      const service = new GraphQLRobotsService({ endpoint, apiKey, siteName: '' });
      await service.fetchRobots().catch((error: Error) => {
        expect(error.message).to.equal(siteNameError);
      });

      return expect(nock.isDone()).to.be.false;
    });

    it('should get robots.txt', async () => {
      mockRobotsRequest(siteName);

      const service = new GraphQLRobotsService({ endpoint, apiKey, siteName });
      const robots = await service.fetchRobots();
      expect(robots).to.equal(siteName);

      return expect(nock.isDone()).to.be.true;
    });

    it('should get robots.txt using clientFactory', async () => {
      mockRobotsRequest(siteName);

      const clientFactory = GraphQLRequestClient.createClientFactory({
        endpoint,
        apiKey,
      });

      const service = new GraphQLRobotsService({ siteName, clientFactory });

      const robots = await service.fetchRobots();
      expect(robots).to.equal(siteName);

      return expect(nock.isDone()).to.be.true;
    });
  });
});
