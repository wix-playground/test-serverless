import type { FunctionContext } from '@wix/serverless-api';
import axios from 'axios';

export async function checkWorkerConfigs(ctx: FunctionContext, authToken: string) {
  const response = await axios.get('http://api.42.wixprod.net/serverless-deployer-service/v2/artifacts');
  //const metadata = response.data.metadata;
  const artifactIds = response.data.artifactIds;
  return await checkArtifactIds(artifactIds, ctx, authToken);
}

async function checkArtifactIds(artifactIds: string[], ctx: FunctionContext, authToken: string) {
  return await Promise.all(artifactIds.map(async (id) =>
    await checkWorkerConfig(id, ctx, authToken)
  ));
}

async function checkWorkerConfig(artifactId: string, ctx: FunctionContext, authToken: string): Promise<boolean> {
  const page = (await axios.get(`https://fryingpan.wixpress.com/api/v2/services/${artifactId}/configs`, {
    headers: {
      'Authorization': `Bearer ${authToken}`
    }
  })).data;
  ctx.logger.info(`Got response: ${page}`);
  const deployments = page['deployments'];
  ctx.logger.info(`Got deployments ${JSON.stringify(deployments)}`);

  return false;
}