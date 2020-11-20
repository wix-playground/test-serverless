import {v4 as uuid} from 'uuid';
import {FunctionsBuilder} from '@wix/serverless-api';

// dummy commit (change)
export default function entry(builder: FunctionsBuilder) {
    return builder.addWebFunction('GET', '/hello', async () => uuid());
}
