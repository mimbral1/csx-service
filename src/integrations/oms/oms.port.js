class OmsPort {
  async getOrderById(orderId) {
    throw new Error('Not implemented');
  }

  async createReplacementOrder(payload) {
    throw new Error('Not implemented');
  }

  async registerClaim(payload) {
    throw new Error('Not implemented');
  }
}

module.exports = { OmsPort };
