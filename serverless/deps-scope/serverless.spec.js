const {expect} = require('chai');
const {app} = require('@wix/serverless-testkit');
const axios = require('axios');
const dayjs = require('dayjs');

describe('example', () => {

  const testkit = app('deps-scope').beforeAndAfter(20000);

  it('should return date', async () => {

    const res = await axios.get(testkit.getUrl(`/now`));

    expect(res.status).to.equal(200);
    expect(res.data).to.deep.equal({date: dayjs('2018-08-08')});
  });
});
