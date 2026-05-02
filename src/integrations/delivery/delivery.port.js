class DeliveryPort {
  async getShipmentByOrderId(orderId) {
    throw new Error('Not implemented');
  }

  async registerDeliveryClaim(payload) {
    throw new Error('Not implemented');
  }

  async requestPickupOrReturn(payload) {
    throw new Error('Not implemented');
  }
}

module.exports = { DeliveryPort };
