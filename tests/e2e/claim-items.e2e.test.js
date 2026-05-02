const { api, withHeaders } = require('../utils/request');

describe('CSX - Claim items', () => {
  let claimId;

  beforeAll(async () => {
    const res = await withHeaders(api().post('/api/claim')).send({
      channelId: 'channel-web',
      motiveId: 'motive-despacho',
      type: ['type-producto-faltante'],
      orderId: `order-items-${Date.now()}`,
      storeId: 'store-1',
      customerId: 'customer-1'
    });

    claimId = res.body.id;
  });

  it('should add claim items', async () => {
    const res = await withHeaders(
      api().post(`/api/claim/${claimId}/items`)
    ).send({
      type: 'item',
      typeId: 'sku-1',
      orderId: 'order-1',
      claimTypeId: 'type-producto-faltante',
      claimItemResolutionId: 'resolution-reponer'
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.ids.length).toBeGreaterThan(0);
  });
});
