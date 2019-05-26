import {FunctionsBuilder} from '@wix/serverless-api';


export = (functionsBuilder: FunctionsBuilder) =>
    functionsBuilder
        .withContextPath('example-serverless')
        .addWebFunction('GET', '/', async (ctx, req) => {
            return {version: 1};
        });