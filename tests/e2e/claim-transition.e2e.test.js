const { api, withHeaders } = require('../utils/request');

describe('CSX - Claim transitions', () => {
  let claimId;

  beforeAll(async () => {
    const res = await withHeaders(api().post('/api/claim')).send({
      channelId: 'channel-web',
      motiveId: 'motive-despacho',
      type: ['type-producto-faltante'],
      orderId: `order-transition-${Date.now()}`,
      storeId: 'store-1',
      customerId: 'customer-1'
    });

    claimId = res.body.id;
  });

  it('should transition claim', async () => {
    const res = await withHeaders(
      api().post(`/api/claim/${claimId}/transition`)
    ).send({
      transitionId: 't1'
    });

    expect(res.statusCode).toBe(200);
  });

  it('should fail invalid transition', async () => {
    const res = await withHeaders(
      api().post(`/api/claim/${claimId}/transition`)
    ).send({
      transitionId: 'invalid-transition'
    });

    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });
});
