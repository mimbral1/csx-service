const { env } = require('../../config/env');
const { request } = require('../http-client');

class DeliveryHttpAdapter {
  async getShipmentByOrderId(orderId) {
    return request({
      method: 'GET',
      url: `${env.DELIVERY_SERVICE_URL}/shipments/by-order/${orderId}`
    });
  }

  async registerDeliveryClaim(payload) {
    return request({
      method: 'POST',
      url: `${env.DELIVERY_SERVICE_URL}/delivery-claims`,
      body: payload
    });
  }

  async requestPickupOrReturn(payload) {
    return request({
      method: 'POST',
      url: `${env.DELIVERY_SERVICE_URL}/returns/pickup`,
      body: payload
    });
  }
}

module.exports = { DeliveryHttpAdapter };
