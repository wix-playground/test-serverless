
module.exports = functionsBuilder =>
  functionsBuilder
    .withContextPath('shaykeless')
    .addWebFunction('GET', '/hello', async (ctx, req) => {
      return {hello: 'shayke world'};
    })
    .addWebFunction('GET', '/hello2', async (ctx, req) => {
      return {hello: 'shayke world2'};
    });
