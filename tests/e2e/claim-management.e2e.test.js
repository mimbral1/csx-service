const { api, withHeaders } = require('../utils/request');

describe('CSX - Claim management', () => {
  let claimId;

  beforeAll(async () => {
    const res = await withHeaders(api().post('/api/claim')).send({
      channelId: 'channel-web',
      motiveId: 'motive-despacho',
      type: ['type-producto-faltante'],
      orderId: `order-management-${Date.now()}`,
      storeId: 'store-1',
      customerId: 'customer-1'
    });

    claimId = res.body.id;
  });

  it('should create claim management', async () => {
    const res = await withHeaders(
      api().post(`/api/claim/${claimId}/management`)
    ).send({
      claimManagementId: 'management-contactar-cliente',
      claimManagementStatusId: 'management-status-pendiente',
      comment: 'Se debe contactar al cliente',
      assignedAreaId: 'area-sac',
      assignedUserId: 'test-user'
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBeDefined();
  });
});
