import * as uuid from 'uuid/v4';
import {FunctionsBuilder} from '@wix/serverless-api';

const functionExport = (functionsBuilder: FunctionsBuilder) =>
    functionsBuilder
        .addWebFunction('GET', '/hello', (ctx, req) => uuid());

module.exports = functionExport;
