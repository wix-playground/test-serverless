import type { FunctionContext } from '@wix/serverless-api';
import WixAspects from '@wix/wix-aspects';
import axios from 'axios';
import _ from 'lodash';

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
  const metadata = response.data.metadata as {count: number, offset: number, total: number};
  const promisesArray = [];
  ctx.logger.info(`Got metadata: ${JSON.stringify(metadata)}`);
  for (var offset = 0; offset < metadata.total; offset + metadata.count) {
    const artifactIds = (await axios.get(`http://api.42.wixprod.net/serverless-deployer-service/v2/artifacts?offset=${offset}`)).data.artifactIds;
    ctx.logger.info(`For offset ${offset}: got artifactIds ${JSON.stringify(artifactIds)}`);
    promisesArray.push(checkArtifactIds(artifactIds, ctx, authToken));
  }
  return await Promise.all(promisesArray);
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
    const deploymentsInConfig = (deployments.value as string).split(',');
    const expectedDeployments = await expectedDeploymentsValue(artifactId, runtimeGrpcClient, ctx);
    ctx.logger.info(`Got deploymentsInConfig ${JSON.stringify(deploymentsInConfig)} and expectedDeployments ${JSON.stringify(expectedDeployments)}`);
    if (!_.isEqual(deploymentsInConfig, expectedDeployments)) {
      return {result: false, desc: `${JSON.stringify(deploymentsInConfig)} != ${JSON.stringify(expectedDeployments)} \n for ${artifactId}`};
    }
  }
  return {result: true, desc: artifactId};
}

async function expectedDeploymentsValue(artifactId: string, runtimeGrpcClient: RuntimeService, ctx: FunctionContext): Promise<string[]> {
  const request: RuntimeDiffRequest = {
    artifactId,
    runtimeId: 'lol',
    existing: [],
  };

  const response: RuntimeDiffResponse = await runtimeGrpcClient.diff(WixAspects.createEmptyStore(), request);

  const sortedDeployments = response.install.sort((a, b) => a.deployment.deployableId.localeCompare(b.deployment.deployableId));
  ctx.logger.info(`Got not sorted deployments\n${response.install}`);
  ctx.logger.info(`Got sorted deployments\n${sortedDeployments}`);

  return sortedDeployments.map((ii) => `${ii.deployment.deployableId}:${ii.deployment.commitRef}`);
}