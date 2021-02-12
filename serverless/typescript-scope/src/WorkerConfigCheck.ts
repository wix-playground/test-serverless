import type { FunctionContext } from '@wix/serverless-api';
import WixAspects from '@wix/wix-aspects';
import axios from 'axios';

import { requests,
  responses,
  services, } from './generated/client/proto-generated';
type Runtime = services.wix.serverless.deployer.api.v2.Runtime;
type RuntimeDiffRequest = requests.wix.serverless.deployer.api.v2.RuntimeDiffRequest;
type RuntimeDiffResponse = responses.wix.serverless.deployer.api.v2.RuntimeDiffResponse;
type Deployment = responses.wix.serverless.deployer.api.v2.Deployment;

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
  const isProductionFlag = page['enforce-healthchecks-per-dep'];
  ctx.logger.info(`Got enforce-healthchecks-per-dep ${JSON.stringify(isProductionFlag)}`);
  if (isProductionFlag?.value === 'true') {
    const deployments = page['deployments'];
    ctx.logger.info(`Got deployments ${JSON.stringify(deployments)}`);
    const deploymentsInConfig = deployments.value;
    const expectedDeployments = await expectedDeploymentsValue(artifactId);
    ctx.logger.info(`Got deploymentsInConfig ${deploymentsInConfig} and expectedDeployments ${expectedDeployments}`);
    return deploymentsInConfig === expectedDeployments;
  }
  return true;
}

async function expectedDeploymentsValue(artifactId: string): Promise<string> {
  const request: RuntimeDiffRequest = {
    artifactId,
    runtimeId: 'lol',
    existing: [],
  };

  const response: RuntimeDiffResponse = await this.runtimeGrpcClient.diff(WixAspects.createEmptyStore(), request);

  return response.install.map((ii) => `${ii.deployment.deployableId}:${ii.deployment.commitRef}`).join(',');
}