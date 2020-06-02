const axios = require("axios");

const DEPLOYMENTS_TO_BUILD = "serverless-deployments-to-build";
const ACTIVE_DEPLOYMENTS_URL = "https://bo.wix.com/serverless-deployer-service/deployments";

module.exports = function (builder) {
  return builder
    .addWebFunction("GET", "/:org/:repo/:scope/:ref", async (context, req) => {
      const { org, repo, scope, ref } = req.params;
      const message = {
        deployment: { org, repo, scope, ref },
        collaborator: "serverless-test-builder@no-mail.com",
      };

      await context.kafka.produceToTopic(DEPLOYMENTS_TO_BUILD, message);
      return message;
    })
    .addWebFunction("GET", "/all", async (context) => {
      const response = await axios.get(ACTIVE_DEPLOYMENTS_URL);
      const deployments = response.data.deployments;
      const promises = deployments.map(async (deployment) => {
        const { org, repo, scope, ref } = deployment;
        const message = {
          deployment: { org, repo, scope, ref },
          collaborator: "serverless-test-builder@no-mail.com",
        };

        return await context.kafka.produceToTopic(DEPLOYMENTS_TO_BUILD, message);
      });

      const result = await Promise.allSettled(promises);
      return result;
    });
};
