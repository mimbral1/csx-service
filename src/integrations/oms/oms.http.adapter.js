const { env } = require('../../config/env');
const { request } = require('../http-client');

class OmsHttpAdapter {
  async getOrderById(orderId) {
    return request({
      method: 'GET',
      url: `${env.OMS_SERVICE_URL}/orders/${orderId}`
    });
  }

  async createReplacementOrder(payload) {
    return request({
      method: 'POST',
      url: `${env.OMS_SERVICE_URL}/orders/replacements`,
      body: payload
    });
  }

  async registerClaim(payload) {
    return request({
      method: 'POST',
      url: `${env.OMS_SERVICE_URL}/claims`,
      body: payload
    });
  }
}

module.exports = { OmsHttpAdapter };
