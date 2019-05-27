import * as uuid from 'uuid/v4';

const helloHandler = uuid;

const functionExport = (functionsBuilder) =>
    functionsBuilder
        .withNamespace('typescript-example')
        .addWebFunction('GET', '/hello', helloHandler);

module.exports = functionExport;
