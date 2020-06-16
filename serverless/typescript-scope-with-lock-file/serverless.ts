import {v4 as uuid} from 'uuid';
import {FunctionsBuilder} from '@wix/serverless-api';

export default function entry(builder: FunctionsBuilder) {
    return builder.addWebFunction('GET', '/hello', async () => uuid());
}
