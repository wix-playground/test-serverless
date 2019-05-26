import {FunctionsBuilder} from '@wix/serverless-api';


export = (functionsBuilder: FunctionsBuilder) =>
    functionsBuilder
        .withNamespace('typescript-example')
        .addWebFunction('GET', '/', async (ctx, req) => {
            return {version: 1};
        });
