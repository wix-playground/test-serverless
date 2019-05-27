import * as uuid from 'uuid/v4';
import { FunctionsBuilder } from '@wix/serverless-api/src/http/FunctionsBuilder';
import { WebFunction } from '@wix/serverless-api/src/http/WebFunction';

const helloHandler: WebFunction = uuid;

const functionExport = (functionsBuilder: FunctionsBuilder) =>
    functionsBuilder
        .withNamespace('typescript-example')
        .addWebFunction('GET', '/hello', helloHandler);

module.exports = functionExport;
