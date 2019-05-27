import * as uuid from 'uuid/v4';

const functionExport = (functionsBuilder) =>
    functionsBuilder
        .withNamespace('typescript-example')
        .addWebFunction('GET', '/hello', (ctx, req) => ({'uuid': uuid()}));

module.exports = functionExport;
