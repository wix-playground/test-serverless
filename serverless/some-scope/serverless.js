const {axios} = require('axios');

module.exports = (fb) =>
    fb.addWebFunction('GET', '/moveToSandbox', async (ctx, req) => {
        const deploymentsData = await axios.get('http://bo.wix.com/serverless-runtime-server/deployments').data;
        return deploymentsData;
      });