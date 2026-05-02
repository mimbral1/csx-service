const { env } = require('../../config/env');
const { request } = require('../http-client');

class FinanceHttpAdapter {
  async requestCreditNote(payload) {
    return request({
      method: 'POST',
      url: `${env.FINANCE_SERVICE_URL}/credit-notes/requests`,
      body: payload
    });
  }

  async requestRefund(payload) {
    return request({
      method: 'POST',
      url: `${env.FINANCE_SERVICE_URL}/refunds/requests`,
      body: payload
    });
  }

  async getDocumentByOrderId(orderId) {
    return request({
      method: 'GET',
      url: `${env.FINANCE_SERVICE_URL}/documents/by-order/${orderId}`
    });
  }
}

module.exports = { FinanceHttpAdapter };
