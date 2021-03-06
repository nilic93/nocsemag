/* eslint-disable camelcase */
/* eslint-disable no-redeclare */
/* eslint-disable prefer-arrow-callback, import/extensions */
// eslint-disable-next-line import/no-unresolved,
import { DynamoDB } from 'aws-sdk';
import { createHash } from 'crypto';
import { SlidesMocks } from './mocks';
import { slides } from '../handler';

function documentClientGetPromiseMock(returnData) {
  DynamoDB.DocumentClient = jest.fn(function mockedDocumentClient() {
    return {
      get(params:{
        TableName: string,
        Key: { content_key: string },
      }) {
        return {
          async promise() {
            return returnData;
          },
        };
      },
    };
  }) as jest.Mock;
}

describe('Slides handler', () => {
  beforeAll(() => {
  });

  afterAll(() => {
  });

  beforeEach(() => {
  });
  it('Should return mocked Item', async () => {
    documentClientGetPromiseMock(Promise.resolve({
      ...SlidesMocks.MockDynamoDBResponse,
    }));
    process.env.IS_LOCAL = 'true';

    const expectedData = {
      content_key: SlidesMocks.MockDynamoDBResponse.Item.content_key,
      data: SlidesMocks.MockDynamoDBResponse.Item.data,
      hash: createHash('md5').update(`${SlidesMocks.MockDynamoDBResponse.Item.updatedAt}`).digest('hex'),
    };
    expect(await slides(undefined)).toStrictEqual(
      {
        statusCode: 200,
        body: JSON.stringify(expectedData),
      },
    );
  });

  it('Should throw InternalServerError Error', async () => {
    documentClientGetPromiseMock(Promise.reject(new Error('Some reason')));
    expect.assertions(1);
    await expect(slides(undefined)).rejects.toEqual(new Error('InternalServerError'));
  });
  it('Should throw InternalServerError Error', async () => {
    (DynamoDB.DocumentClient as jest.Mock).mockRestore();
    await expect(slides(undefined)).rejects.toEqual(new Error('InternalServerError'));
  });
});
