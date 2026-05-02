class DeliveryMockAdapter {
  async getShipmentByOrderId(orderId) {
    return {
      orderId,
      shipmentId: `mock-shipment-${orderId}`,
      status: 'delivered'
    };
  }

  async registerDeliveryClaim(payload) {
    return {
      ok: true,
      payload
    };
  }

  async requestPickupOrReturn(payload) {
    return {
      pickupId: `mock-pickup-${Date.now()}`,
      status: 'requested',
      payload
    };
  }
}

module.exports = { DeliveryMockAdapter };
