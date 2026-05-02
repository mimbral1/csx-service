class FinancePort {
  async requestCreditNote(payload) {
    throw new Error('Not implemented');
  }

  async requestRefund(payload) {
    throw new Error('Not implemented');
  }

  async getDocumentByOrderId(orderId) {
    throw new Error('Not implemented');
  }
}

module.exports = { FinancePort };
