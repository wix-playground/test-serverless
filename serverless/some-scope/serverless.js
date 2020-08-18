const axios = require('axios');

module.exports = (fb) =>
    fb.addWebFunction('GET', '/moveToSandbox', async (ctx, req) => {
        const deploymentsData = (await axios.get('http://bo.wix.com/serverless-runtime-server/deployments')).data;
        const deployments = deploymentsData.deployments;
        const sandboxId = 'com.wixpress.serverless.serverless-sandbox-1';
        const movedSuccessfully = [];
        const failedToMove = [];
        const candidates = Object.keys(deployments);
        for (let i = candidates.length/2; i < candidates.length; i++) {
            const d = candidates[i];
            try {
                const result = await axios.post('http://bo.wix.com/serverless-deployer-service/v2/deployables/artifacts', {
                    deployable_id: d,
                    artifact_id: sandboxId,
                    delay_in_seconds: 0
                });
                ctx.logger.info(`Moved ${d} to ${sandboxId} with the result ${result.data}`);
                movedSuccessfully.push(d);
            } catch (e) {
                ctx.logger.error(`Failed to move ${d} to ${sandboxId} with the error ${JSON.stringify(e)}`);
                failedToMove.push(d);
            }
            await new Promise((res) => {setTimeout(res, 10000)});
        }
        return { movedSuccessfully, failedToMove };
      });