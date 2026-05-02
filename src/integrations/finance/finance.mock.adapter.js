class FinanceMockAdapter {
  async requestCreditNote(payload) {
    return {
      creditNoteId: `mock-credit-note-${Date.now()}`,
      status: 'requested',
      payload
    };
  }

  async requestRefund(payload) {
    return {
      refundId: `mock-refund-${Date.now()}`,
      status: 'requested',
      payload
    };
  }

  async getDocumentByOrderId(orderId) {
    return {
      orderId,
      documentId: `mock-document-${orderId}`,
      documentType: 'invoice'
    };
  }
}

module.exports = { FinanceMockAdapter };
