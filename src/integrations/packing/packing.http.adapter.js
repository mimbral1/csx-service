const { env } = require('../../config/env');
const { request } = require('../http-client');

class PackingHttpAdapter {
  async getPackageById(packageId) {
    return request({
      method: 'GET',
      url: `${env.PACKING_SERVICE_URL}/packages/${packageId}`
    });
  }

  async registerPackageClaim(payload) {
    return request({
      method: 'POST',
      url: `${env.PACKING_SERVICE_URL}/package-claims`,
      body: payload
    });
  }
}

module.exports = { PackingHttpAdapter };
