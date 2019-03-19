const {FullHttpResponse} = require('@wix/serverless-api');
const moment = require('moment');

module.exports = (functionsBuilder) =>
  functionsBuilder
    .withNamespace('moment')
    .addWebFunction('GET', '/now', async (ctx, req) => {
      return {date: moment().format()};
    });
