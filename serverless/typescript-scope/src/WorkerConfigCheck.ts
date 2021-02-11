import type { FunctionContext } from '@wix/serverless-api';
import axios from 'axios';
import { JSDOM } from 'jsdom';

export async function checkWorkerConfigs(ctx: FunctionContext) {
  const response = await axios.get('http://api.42.wixprod.net/serverless-deployer-service/v2/artifacts');
  //const metadata = response.data.metadata;
  const artifactIds = response.data.artifactIds;
  await checkArtifactIds(artifactIds, ctx);
}

async function checkArtifactIds(artifactIds: string[], ctx: FunctionContext) {
  await Promise.all(artifactIds.map(async (id) =>
    await checkWorkerConfig(id, ctx)
  ));
}

async function checkWorkerConfig(artifactId: string, ctx: FunctionContext) {
  const page = (await axios(`https://fryingpan.wixpress.com/services/${artifactId}/edit`)).data;
  ctx.logger.info(`Got response: ${page}`);
  const dom = new JSDOM(page, {
    features: {
      QuerySelector: true
    }
  });
  ctx.logger.info(`Got dom: ${JSON.stringify(dom.window.document.querySelector)}`);
}