const { env } = require('../../config/env');
const { request } = require('../http-client');

class InventoryHttpAdapter {
  async getAvailableStock({ sku, storeId }) {
    return request({
      method: 'GET',
      url: `${env.INVENTORY_SERVICE_URL}/stock/available?sku=${sku}&storeId=${storeId}`
    });
  }

  async reserveStock(payload) {
    return request({
      method: 'POST',
      url: `${env.INVENTORY_SERVICE_URL}/reservations`,
      body: payload
    });
  }

  async releaseReservation(payload) {
    return request({
      method: 'POST',
      url: `${env.INVENTORY_SERVICE_URL}/reservations/release`,
      body: payload
    });
  }
}

module.exports = { InventoryHttpAdapter };
