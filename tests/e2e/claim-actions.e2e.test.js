const { api, withHeaders } = require('../utils/request');

describe('CSX - Claim actions', () => {
  let claimId;

  beforeAll(async () => {
    const res = await withHeaders(api().post('/api/claim')).send({
      channelId: 'channel-web',
      motiveId: 'motive-despacho',
      type: ['type-producto-faltante'],
      orderId: `order-actions-${Date.now()}`,
      storeId: 'store-1',
      customerId: 'customer-1'
    });

    claimId = res.body.id;
  });

  it('should assign user', async () => {
    const res = await withHeaders(
      api().post(`/api/claim/${claimId}/assign`)
    ).send({
      assigneeId: 'user-sac-1'
    });

    expect(res.statusCode).toBe(200);
  });

  it('should scale claim', async () => {
    const res = await withHeaders(
      api().post(`/api/claim/${claimId}/scale`)
    ).send();

    expect(res.statusCode).toBe(200);
  });
});
