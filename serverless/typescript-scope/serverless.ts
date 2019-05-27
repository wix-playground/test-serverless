import * as uuid from 'uuid/v4';

const functionExport = (functionsBuilder) =>
    functionsBuilder
        .withNamespace('typescript-example')
        .addWebFunction('GET', '/hello', () => ({data: uuid()}));

module.exports = functionExport;
