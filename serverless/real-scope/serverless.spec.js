const {expect} = require('chai');
const {app, whenCalled} = require('@wix/serverless-testkit');
const axios = require('axios');
const {PaymentServicesWeb, OrderType, OrderItemCategory} = require('@wix/ambassador-payment-services-web/rpc');
const long = require('long');

describe('example', () => {

  const testkit = app('real-scope').beforeAndAfter(20000);

  const accountId = 'accountId'
  const orderToCreate = {
    accountId,
    description: {
      verticalOrderId: 'verticalOrderId',
      amount: 123.32,
      noShipping: false,
      currency: 'USD',
      type: OrderType.ONE_TIME,
      externalData: {},
      items: [{
        name: 'item',
        quantity: 1,
        description: 'description',
        price: 123.32,
        weightInKg: 1.0,
        id: 'item',
        category: OrderItemCategory.PHYSICAL
      }]
    },
    urls: {
      eventHook: 'rpc',
      simpleReturnUrl: 'http://google.com'
    }
  }

  it('should create order in cashier', async () => {
    const cashierStub = testkit.ambassador.createStub(PaymentServicesWeb);
    cashierStub.OrderService().create.when(orderToCreate).resolve({order: {id: 'order-id'}});

    const url = testkit.getUrl(`/serverless/example?accountId=${accountId}`);
    const res = await axios.post(url, {});

    expect(res.status).to.equal(201);
    expect(res.data).to.deep.equal({id: 'order-id'});
  });

  it('should fail with 400 if accountId is not provided', async () => {
    const res = await axios.post(testkit.getUrl(`/serverless/example`), {}, {validateStatus: () => true});
    expect(res.status).to.equal(400);
  })
});
