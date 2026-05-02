const { api, withHeaders } = require('../utils/request');

describe('CSX - Claim compensation', () => {
  let claimId;

  beforeAll(async () => {
    const res = await withHeaders(api().post('/api/claim')).send({
      channelId: 'channel-web',
      motiveId: 'motive-despacho',
      type: ['type-producto-faltante'],
      orderId: `order-comp-${Date.now()}`,
      storeId: 'store-1',
      customerId: 'customer-1'
    });

    claimId = res.body.id;
  });

  it('should assign compensation', async () => {
    const res = await withHeaders(
      api().post(`/api/claim-compensation/claim/${claimId}/assign`)
    ).send({
      compensationId: 'comp-descuento',
      amount: 5000
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBeDefined();
  });
});
