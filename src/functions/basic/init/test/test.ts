// eslint-disable-next-line import/no-unresolved,import/extensions
import { InitMocks } from './mocks';

describe('Init handler', () => {
  beforeAll(() => {
    console.log('test');
  });

  afterAll(() => {
  });

  beforeEach(() => {
  });

  it('Should run the test', async () => {
    console.log('Test has been run successfully');
    expect(true).toBe(true);
  });
});
