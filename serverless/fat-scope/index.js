module.exports = function (functionsBuilder) {
    functionsBuilder
        .addWebFunction('GET', '/now', async (ctx, req) => {
            return { date: new Date().toLocaleString() };
        })
}
