import type { FunctionContext } from '@wix/serverless-api';
import WixAspects from '@wix/wix-aspects';
import axios from 'axios';

import { requests,
  responses,
  services, } from './generated/client/proto-generated';
const Runtime = services.wix.serverless.deployer.api.v2.Runtime;
type RuntimeService = services.wix.serverless.deployer.api.v2.Runtime;
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
  const runtimeGrpcClient = ctx.grpcClient(Runtime, 'com.wixpress.platform.serverless-deployer-service');
  return await Promise.all(artifactIds.map(async (id) =>
    await checkWorkerConfig(id, ctx, authToken, runtimeGrpcClient)
  ));
}

async function checkWorkerConfig(artifactId: string, ctx: FunctionContext, authToken: string, runtimeGrpcClient: RuntimeService): Promise<{result: boolean, desc: string}> {
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
    const expectedDeployments = await expectedDeploymentsValue(artifactId, runtimeGrpcClient);
    ctx.logger.info(`Got deploymentsInConfig ${deploymentsInConfig} and expectedDeployments ${expectedDeployments}`);
    if (deploymentsInConfig !== expectedDeployments) {
      return {result: false, desc: `${deploymentsInConfig} != ${expectedDeployments} \n for ${artifactId}`};
    }
  }
  return {result: true, desc: ''};
}

async function expectedDeploymentsValue(artifactId: string, runtimeGrpcClient: RuntimeService): Promise<string> {
  const request: RuntimeDiffRequest = {
    artifactId,
    runtimeId: 'lol',
    existing: [],
  };

  const response: RuntimeDiffResponse = await runtimeGrpcClient.diff(WixAspects.createEmptyStore(), request);

  return response.install.map((ii) => `${ii.deployment.deployableId}:${ii.deployment.commitRef}`).join(',');
}