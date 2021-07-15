import { app } from '@wix/serverless-testkit';
import axios from 'axios';

describe('hello, serverless', () => {
  const testkit = app({});
  testkit.beforeAndAfter(10000);

  it('should say hello', async () => {
    const result = await axios.get(testkit.getUrl('/hello'));
    expect(result.data).toStrictEqual('hello, serverless');
  });
});
