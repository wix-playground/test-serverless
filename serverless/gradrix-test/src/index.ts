import type { FunctionsBuilder } from '@wix/serverless-api';
import { FullHttpResponse } from '@wix/serverless-api';

module.exports = function builder (builder: FunctionsBuilder) {
  return builder
    .addWebFunction('GET', '/hello', async () => new FullHttpResponse({ status: 200, body: 'hello, serverless' }));
};
