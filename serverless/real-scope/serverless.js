const {FullHttpResponse, HttpError} = require('@wix/serverless-api');
const {PaymentServicesWeb, OrderDescriptionOrderType, V2OrderItemOrderItemCategory} = require('@wix/ambassador-payment-services-web');

const description = {
  verticalOrderId: 'verticalOrderId',
  amount: 123.32,
  noShipping: false,
  currency: 'USD',
  type: OrderDescriptionOrderType.ONE_TIME,
  externalData: {},
  items: [{
    name: 'item',
    quantity: 1,
    description: 'description',
    price: 123.32,
    weightInKg: 1.0,
    id: 'item',
    category: V2OrderItemOrderItemCategory.PHYSICAL
  }]
};

const urls = {
  eventHook: 'rpc',
  simpleReturnUrl: 'http://google.com'
};

module.exports = (functionsBuilder) =>
  functionsBuilder
    .withNamespace('example')
    .addWebFunction('POST', '/', async (ctx, req) => {
      if (!req.query.accountId) {
        throw new HttpError({status: 401});
      }
      const request = {accountId: req.query.accountId, description, urls};
      const {order} = await PaymentServicesWeb().OrderService()(ctx.aspects).create(request);
      await ctx.datastore.put('data', order);
      return new FullHttpResponse({status: 201, body: {id: order.id}});
    })
    .addWebFunction('GET', '/get', async (ctx, req) => {
      const order = await ctx.datastore.get('data');
      return {order};
    });
