import {FunctionsBuilder} from '@wix/serverless-api';


export = (functionsBuilder: FunctionsBuilder) =>
    functionsBuilder
        .addWebFunction('GET', '/', async (ctx, req) => {
            return {version: 1};
        });
