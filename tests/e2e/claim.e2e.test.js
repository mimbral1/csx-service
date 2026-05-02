const { api, withHeaders } = require('../utils/request');

describe('CSX - Claim', () => {
  let claimId;

  it('should create a claim', async () => {
    const res = await withHeaders(
      api().post('/api/claim')
    ).send({
      channelId: 'channel-web',
      motiveId: 'motive-despacho',
      type: ['type-producto-faltante'],
      orderId: `order-${Date.now()}`,
      storeId: 'store-1',
      customerId: 'customer-1'
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBeDefined();

    claimId = res.body.id;
  });

  it('should get claim', async () => {
    const res = await withHeaders(
      api().get(`/api/claim/${claimId}`)
    );

    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(claimId);
  });

  it('should not create duplicate claim with same idempotency key', async () => {
    const idempotencyKey = `test-key-${Date.now()}`;
    const payload = {
      channelId: 'channel-web',
      motiveId: 'motive-despacho',
      type: ['type-producto-faltante'],
      orderId: `order-dup-${Date.now()}`,
      storeId: 'store-1',
      customerId: 'customer-1'
    };

    const res1 = await withHeaders(api().post('/api/claim'))
      .set('idempotency-key', idempotencyKey)
      .send(payload);

    const res2 = await withHeaders(api().post('/api/claim'))
      .set('idempotency-key', idempotencyKey)
      .send(payload);

    expect(res1.statusCode).toBe(200);
    expect(res2.statusCode).toBe(200);
    expect(res1.body.id).toBe(res2.body.id);
  });
});
