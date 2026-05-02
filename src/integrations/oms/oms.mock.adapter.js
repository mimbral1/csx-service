class OmsMockAdapter {
  async getOrderById(orderId) {
    return {
      id: orderId,
      status: 'delivered',
      customerId: 'mock-customer-id',
      storeId: 'mock-store-id',
      items: []
    };
  }

  async createReplacementOrder(payload) {
    return {
      id: `mock-replacement-${Date.now()}`,
      status: 'created',
      payload
    };
  }

  async registerClaim(payload) {
    return {
      ok: true,
      payload
    };
  }
}

module.exports = { OmsMockAdapter };
