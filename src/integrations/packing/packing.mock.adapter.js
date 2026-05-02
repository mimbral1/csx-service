class PackingMockAdapter {
  async getPackageById(packageId) {
    return {
      id: packageId,
      status: 'delivered',
      items: []
    };
  }

  async registerPackageClaim(payload) {
    return {
      ok: true,
      payload
    };
  }
}

module.exports = { PackingMockAdapter };
