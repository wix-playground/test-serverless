import type { FunctionContext } from '@wix/serverless-api';
import axios from 'axios';
import { JSDOM } from 'jsdom';

export async function checkWorkerConfigs(ctx: FunctionContext, cookies: Record<string, string>) {
  const response = await axios.get('http://api.42.wixprod.net/serverless-deployer-service/v2/artifacts');
  //const metadata = response.data.metadata;
  const artifactIds = response.data.artifactIds;
  return await checkArtifactIds(artifactIds, ctx, cookies);
}

async function checkArtifactIds(artifactIds: string[], ctx: FunctionContext, cookies: Record<string, string>) {
  return await Promise.all(artifactIds.map(async (id) =>
    await checkWorkerConfig(id, ctx, cookies)
  ));
}

async function checkWorkerConfig(artifactId: string, ctx: FunctionContext, cookies: Record<string, string>): Promise<boolean> {
  const page = (await axios.get(`https://fryingpan.wixpress.com/services/${artifactId}/edit`, {
    headers: {
      'Set-Cookie': Object.keys(cookies).map((key) => `${key}=${cookies[key]}`).join('=')
    }
  })).data;
  ctx.logger.info(`Got response: ${page}`);
  const dom = new JSDOM(page);
  const configs = dom.window.document.querySelectorAll('div.service_configs');
  ctx.logger.info(`Got configs of size ${configs.length}: ${JSON.stringify(configs)}`);
  configs.forEach((config) => {
    ctx.logger.info(config.innerHTML);
  });
  return false;
}