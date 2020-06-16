import {app} from '@wix/serverless-testkit';
import axios from 'axios';

describe('typescript-scope-with-lock-file', () => {
  const testkit = app('typescript-scope-with-lock-file').beforeAndAfter(20000);

  it('should response with hello', async () => {
    const res = await axios.post(testkit.getUrl(`/hello`), {}, {validateStatus: () => true});
    expect(res.status).toBe(401);
  })
});
