const {ServerlessTestkit, app} = require('@wix/serverless-testkit');
const {WixMetaSiteManagerWebapp} = require('@wix/ambassador-wix-meta-site-manager-webapp/rpc');
const {v4} = require('uuid');
const axios = require('axios');

describe('ambassador-conflict', () => {
  const testkit = app('ambassador-conflict');
  testkit.beforeAndAfter();

  beforeEach(() => {
    testkit.ambassador.reset();
  });

  it('should intercept json-rpc requests', async () => {
    const userId = v4();
    const metaSiteManagerStub = testkit.ambassador.createStub(WixMetaSiteManagerWebapp);
    metaSiteManagerStub.MetaSiteManager().listSites.when(userId).resolve(['a', 'b', 'c']);

    const res = await axios.get(testkit.getUrl(`/sites/${userId}`));
    expect(res.data).toStrictEqual(['a', 'b', 'c']);
  });
});
