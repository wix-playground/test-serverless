import PromiseQueue from 'promise-queue';
import {Cluster, ClusteredTopic, FunctionsBuilder} from '@wix/serverless-api';
import { checkWorkerConfigs } from './src/WorkerConfigCheck';
import axios from 'axios';
import { services, responses } from './src/generated/client/proto-generated';

import { PremiumGoogleMailboxes } from '@wix/ambassador-premium-google-mailboxes/rpc';
import type {
  GetGoogleUsersRequest,
  GetGoogleUsersResponse,
} from '@wix/ambassador-premium-google-mailboxes/types';

import { isBusinessError } from '@wix/wix-errors';

const topic: ClusteredTopic = {
  name: 'serverless-isolator-jobs',
  cluster: Cluster.Users,
}

export const SERVERLESS_APPLICATION_DOMAIN_EVENTS = {
  name: 'domain_events_wix.serverless.v3.application',
  cluster: Cluster.Users,
};

module.exports = (functionsBuilder: FunctionsBuilder) =>
    functionsBuilder
      .addStaticContent('static')
      .addWebFunction('GET', '/hello', { propagateRemoteErrors: true }, async (ctx, req) => {
          const mailboxApi = PremiumGoogleMailboxes()
            .MailboxManagementServiceApi()(ctx.aspects);
          return await mailboxApi.getGoogleUsers(req.query);
      })
      .addWebFunction('GET', '/check', {timeoutMillis: 900000}, async (ctx, req) => {
        return await checkWorkerConfigs(ctx, req.query.authToken, req.query.offset);
      })
      .addGreyhoundConsumer(topic, async (ctx, message) => {
        const appId: string = message.appId;
        if (appId.startsWith('dwhaas')) {
          ctx.logger.info(`Got message: ${JSON.stringify(message)}`);
        } 
      })
      .addGreyhoundConsumer(SERVERLESS_APPLICATION_DOMAIN_EVENTS, async (ctx, message) => {
        if (message.slug === 'deploy_finished_action') {
          ctx.logger.info(`Got deploy_finished_action: ${JSON.stringify(message)}`);
        }
      })
      .addWebFunction('GET', '/findFpCollisions', async (ctx) => {
        const applicationService = ctx.grpcClient(services.wix.serverless.deployer.api.v3.Applications, 'com.wixpress.platform.serverless-deployer-service');
        const applications = await applicationService.list(ctx.aspects);
        const fpToken = ctx.getConfig('fryingpan-token');
        const fpServicesResponse = await axios.get(`https://fryingpan.wixpress.com/api/v2/services`, { 
          headers: {
            'Authorization': `${fpToken}`,
            'Accept': '*/*',
            'Content-Type': 'application/json'
          } 
        });
        const fpServices: Array<string> = fpServicesResponse.data.map((serviceJson) => { const match  = serviceJson.id.match(/\.([a-zA-Z0-9/-]+$)/);

      if (match === null) {
        ctx.logger.info(`Got no-match ${serviceJson.id}`);
        return serviceJson.id;
      } else {
        return match[1];
      }
 });
        const result = fpServices.filter((value) => applications.applicationIds.includes(value));
        ctx.logger.info(`Got conflicting applicationIds: ${JSON.stringify(result)}`)
        return result;
      })
      .addWebFunction('GET', '/findSegments', async (ctx, req) => {
        const artifactService = ctx.grpcClient(services.wix.serverless.deployer.api.v2.ProductionArtifacts, 'com.wixpress.platform.serverless-deployer-service');
        const artifactIds = [
          "com.wixpress.platform.chat-corvid-integration",
          "com.wixpress.platform.chat-delete-status-service",
          "com.wixpress.platform.os-serverless-prod",
          "com.wixpress.platform.os-site-details",
          "com.wixpress.platform.serverless-42-only-env",
          "com.wixpress.platform.serverless-assignee",
          "com.wixpress.platform.serverless-blog",
          "com.wixpress.platform.serverless-bo-env",
          "com.wixpress.platform.serverless-bookings-prod",
          "com.wixpress.platform.serverless-chat",
          "com.wixpress.platform.serverless-chat-search",
          "com.wixpress.platform.serverless-chat-search-migration",
          "com.wixpress.platform.serverless-dashboard-analytics",
          "com.wixpress.platform.serverless-devcenter-prod",
          "com.wixpress.platform.serverless-deviant-art",
          "com.wixpress.platform.serverless-ecom",
          "com.wixpress.platform.serverless-forum",
          "com.wixpress.platform.serverless-install-wishlist-migration",
          "com.wixpress.platform.serverless-on-serverless",
          "com.wixpress.platform.serverless-premium-management-prod",
          "com.wixpress.platform.serverless-restaurants",
          "com.wixpress.platform.serverless-rich-content-services",
          "com.wixpress.platform.serverless-runtime-server",
          "com.wixpress.platform.serverless-velocity-infra",
          "com.wixpress.python-serverless-draft-2",
          "com.wixpress.python-serverless-playground",
          "com.wixpress.python-serverless-prod",
          "com.wixpress.serverless.sandbox-ape-status-27b5c636",
          "com.wixpress.serverless.sandbox-editor-flow-7cecc7a7",
          "com.wixpress.serverless.sandbox-kore-39078df7",
          "com.wixpress.serverless.sandbox-korebiprocessor-68557ff5",
          "com.wixpress.serverless.sandbox-logs-support-8ab94fb6",
          "com.wixpress.serverless.sandbox-test-some-func-db641e49",
          "com.wixpress.serverless.sandbox-transfer-site-dialog-2fdd11f6",
          "com.wixpress.serverless.sandbox-uncle-bot-473dd7aa",
          "com.wixpress.serverless.sandbox-yoyo-5cdca1ae",
          "com.wixpress.serverless.sandbox-yoyo1-76919417",
          "com.wixpress.serverless.sandbox-yuval-usage-report-ab7ca422",
          "com.wixpress.serverless.serverless-adi",
          "com.wixpress.serverless.serverless-ait-42",
          "com.wixpress.serverless.serverless-analytics-ng",
          "com.wixpress.serverless.serverless-answers",
          "com.wixpress.serverless.serverless-answers-proservices",
          "com.wixpress.serverless.serverless-app-market",
          "com.wixpress.serverless.serverless-app-market-feds",
          "com.wixpress.serverless.serverless-app-service-autorelease",
          "com.wixpress.serverless.serverless-ascend",
          "com.wixpress.serverless.serverless-autocms",
          "com.wixpress.serverless.serverless-bi-tools",
          "com.wixpress.serverless.serverless-branch-io-data-integration",
          "com.wixpress.serverless.serverless-branded-apps",
          "com.wixpress.serverless.serverless-chat-business-info",
          "com.wixpress.serverless.serverless-chat-event-reporter",
          "com.wixpress.serverless.serverless-chat-immigrator",
          "com.wixpress.serverless.serverless-chat-mobile-app-badge",
          "com.wixpress.serverless.serverless-chat-multilingual",
          "com.wixpress.serverless.serverless-chat-presence-mdlwr-service",
          "com.wixpress.serverless.serverless-chat-widget",
          "com.wixpress.serverless.serverless-cloud-scraper",
          "com.wixpress.serverless.serverless-contacts-dashboard-widget",
          "com.wixpress.serverless.serverless-contacts-profile",
          "com.wixpress.serverless.serverless-corvid-prod",
          "com.wixpress.serverless.serverless-crm-automation",
          "com.wixpress.serverless.serverless-crm-financial",
          "com.wixpress.serverless.serverless-ctoo",
          "com.wixpress.serverless.serverless-ctp",
          "com.wixpress.serverless.serverless-customer-care",
          "com.wixpress.serverless.serverless-dashboard-premium-alerts",
          "com.wixpress.serverless.serverless-dashboard-setup",
          "com.wixpress.serverless.serverless-dashboard-site-details",
          "com.wixpress.serverless.serverless-dashboard-suggestions",
          "com.wixpress.serverless.serverless-data-science",
          "com.wixpress.serverless.serverless-dealers",
          "com.wixpress.serverless.serverless-docs",
          "com.wixpress.serverless.serverless-doitwithme",
          "com.wixpress.serverless.serverless-dwhaas",
          "com.wixpress.serverless.serverless-dwhaas-2",
          "com.wixpress.serverless.serverless-dwhaas-3",
          "com.wixpress.serverless.serverless-dwhaas-4",
          "com.wixpress.serverless.serverless-dwhaas-crm-contacts",
          "com.wixpress.serverless.serverless-ecom-noprod",
          "com.wixpress.serverless.serverless-editor",
          "com.wixpress.serverless.serverless-editor-app-renderer",
          "com.wixpress.serverless.serverless-editor-prod",
          "com.wixpress.serverless.serverless-editorx",
          "com.wixpress.serverless.serverless-education",
          "com.wixpress.serverless.serverless-events-fed",
          "com.wixpress.serverless.serverless-experimental",
          "com.wixpress.serverless.serverless-experimental-2",
          "com.wixpress.serverless.serverless-experts",
          "com.wixpress.serverless.serverless-falcon-ci",
          "com.wixpress.serverless.serverless-faq-chat-bot",
          "com.wixpress.serverless.serverless-fed-infra",
          "com.wixpress.serverless.serverless-forms",
          "com.wixpress.serverless.serverless-funnel",
          "com.wixpress.serverless.serverless-fw-team",
          "com.wixpress.serverless.serverless-gliba-gh-stress-test",
          "com.wixpress.serverless.serverless-gliba-gh-stress-test-2",
          "com.wixpress.serverless.serverless-gliba-gh-stress-test-batch",
          "com.wixpress.serverless.serverless-gliba-gh-stress-test-chat",
          "com.wixpress.serverless.serverless-gliba-gh-stress-test-manyc",
          "com.wixpress.serverless.serverless-gliba-gh-stress-test-octopus",
          "com.wixpress.serverless.serverless-international-growth",
          "com.wixpress.serverless.serverless-mcloud-dev",
          "com.wixpress.serverless.serverless-members-search-migrations",
          "com.wixpress.serverless.serverless-monitoring-apps",
          "com.wixpress.serverless.serverless-multilingual-languages",
          "com.wixpress.serverless.serverless-mysql-sandbox",
          "com.wixpress.serverless.serverless-os-dashboard",
          "com.wixpress.serverless.serverless-outreach",
          "com.wixpress.serverless.serverless-payments",
          "com.wixpress.serverless.serverless-payments-checkout",
          "com.wixpress.serverless.serverless-perf-infra",
          "com.wixpress.serverless.serverless-photography",
          "com.wixpress.serverless.serverless-polls",
          "com.wixpress.serverless.serverless-polls-client",
          "com.wixpress.serverless.serverless-premium-domains",
          "com.wixpress.serverless.serverless-promote",
          "com.wixpress.serverless.serverless-promote-analytics-reporter",
          "com.wixpress.serverless.serverless-promote-connect",
          "com.wixpress.serverless.serverless-promote-migrations",
          "com.wixpress.serverless.serverless-restaurants-qr-code",
          "com.wixpress.serverless.serverless-s8s-autoscaler",
          "com.wixpress.serverless.serverless-sandbox-1",
          "com.wixpress.serverless.serverless-sandbox-2",
          "com.wixpress.serverless.serverless-sandbox-isolator",
          "com.wixpress.serverless.serverless-security",
          "com.wixpress.serverless.serverless-sled",
          "com.wixpress.serverless.serverless-spinnaker-test1",
          "com.wixpress.serverless.serverless-spinnaker-test2",
          "com.wixpress.serverless.serverless-stores-ord-events-converter",
          "com.wixpress.serverless.serverless-subscriptions",
          "com.wixpress.serverless.serverless-support",
          "com.wixpress.serverless.serverless-viewer-server",
          "com.wixpress.serverless.serverless-wix-apps-contents",
          "com.wixpress.serverless.serverless-wix-data-client",
          "com.wixpress.serverless.serverless-wix-owners-app",
          "com.wixpress.serverless.serverless-wix-style-react-dashboard",
          "com.wixpress.serverless.serverless-wixstores-email-fulfiller",
          "com.wixpress.serverless.serverless-wixstores-orders-export",
          "com.wixpress.serverless.serverless-wixstores-tpa-site-ss",
          "com.wixpress.serverless.serverless-yoshi-ascend-camp-widgets",
          "com.wixpress.serverless.serverless-yoshi-bookings-dash-widgets",
          "com.wixpress.serverless.serverless-yoshi-business-dashboard-app",
          "com.wixpress.serverless.serverless-yoshi-challenges-web-bm",
          "com.wixpress.serverless.serverless-yoshi-challenges-web-ooi",
          "com.wixpress.serverless.serverless-yoshi-dash-suggestions-app",
          "com.wixpress.serverless.serverless-yoshi-ds-ml-platform",
          "com.wixpress.serverless.serverless-yoshi-etpa-container-v2",
          "com.wixpress.serverless.serverless-yoshi-flow-fullstack",
          "com.wixpress.serverless.serverless-yoshi-my-account-ooi",
          "com.wixpress.serverless.serverless-yoshi-sandbox1",
          "com.wixpress.serverless.serverless-yoshi-sandbox2",
          "com.wixpress.serverless.serverless-yoshi-sandbox3",
          "com.wixpress.serverless.serverless-yoshi-sandbox4",
          "com.wixpress.serverless.serverless-yoshi-sandbox5",
          "com.wixpress.serverless.serverless-yoshi-vod-library"
        ];
      const token = ctx.getConfig('token');
      return await Promise.all(artifactIds.map(async (artifactId) => {
        ctx.logger.info(`Sending request to https://fryingpan.wixpress.com/api/v2/services/${artifactId}`);
          try {
            const artifactJson = await axios.get(`https://fryingpan.wixpress.com/api/v2/services/${artifactId}`, { 
              headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': '*/*',
                'Content-Type': 'application/json'
              } 
            });

            const segment = artifactJson.data.segment_id;
            if (typeof segment === 'string') {
              ctx.logger.info(`Setting segment ${segment} for ${artifactId}`);
              const result = artifactService.update(ctx.aspects, {
                artifactId,
                artifact: {
                  segment
                },
                fieldMask: ['segment']
              });
              return {
                artifactId,
                segment,
                result
              };
            }
          } catch (err) {
            ctx.logger.error(`Got error ${err}`, err);
          }
      }));
   })
  .addWebFunction('GET', '/appsWithServerlessCi', async (ctx) => {
    const applicationService = ctx.grpcClient(
      services.wix.serverless.deployer.api.v3.Applications,
      'com.wixpress.platform.serverless-deployer-service'
    );
    const appsList = await applicationService.list(ctx.aspects, {});
    ctx.logger.info(`Got appsList`, appsList);
    const pq = new PromiseQueue(5, Number.POSITIVE_INFINITY);
    const promises = appsList.applicationIds.map((appId) =>
      pq.add(() => applicationService.get(ctx.forBackgroundJob().aspects, { applicationId: appId })
        .then((appInfo) => {
          ctx.logger.info(`Got response for ${appId}`, appInfo);
          return {
            applicationId: appId,
            ci: appInfo.application.ci,
            yoshi: appInfo.application.tags.some((tag) => tag === responses.wix.serverless.deployer.api.v3.Application.Tag.YOSHI),
          };
        })
    ));
    return await Promise.all(promises)
      .then((results) => {
        ctx.logger.error(`Got results`, results);
        ctx.cloudStore.keyValueStore.set({ key: 'appsAndCis', value: results});
        const falcon = results.filter((app: any) => typeof app.ci.falcon === 'object');
        const legacy = results.filter((app: any) => typeof app.ci.falcon !== 'object');
        const yoshi = results.filter((app: any) => app.yoshi);
        return {
          legacySize: legacy.length,
          falconSize: falcon.length,
          yoshiSize: yoshi.length,
          legacy,
          falcon,
        }
      });
  });
