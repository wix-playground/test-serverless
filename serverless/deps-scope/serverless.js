const dayjs = require('dayjs');

module.exports = (functionsBuilder) =>
  functionsBuilder
    .addWebFunction('GET', '/now', async (ctx, req) => {
      return {date: dayjs('2018-08-08')};
    });