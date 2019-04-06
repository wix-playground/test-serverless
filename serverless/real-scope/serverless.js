const {FullHttpResponse} = require('@wix/serverless-api');
const {PaymentServicesWeb, OrderType, OrderItemCategory} = require('@wix/ambassador-payment-services-web');

const description = {
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
};

module.exports = (functionsBuilder) =>
  functionsBuilder
    .withNamespace('example')
    .addWebFunction('POST', '/', async (ctx, req) => {
      const val = {accountId: req.query.accountId, description};
      console.log('!!!!!!' + JSON.stringify(val));  
      await PaymentServicesWeb().OrderService()(ctx.aspects).create(val);
      await ctx.datastore.put('data', {val: 'value'});
      return new FullHttpResponse({status: 204, body: {}});
    })
    .addWebFunction('GET', '/get', async (ctx, req) => {
      const value = await ctx.datastore.get('data');
      return {version: 8, message: 'message', ...value};
    });
