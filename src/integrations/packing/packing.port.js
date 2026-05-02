class PackingPort {
  async getPackageById(packageId) {
    throw new Error('Not implemented');
  }

  async registerPackageClaim(payload) {
    throw new Error('Not implemented');
  }
}

module.exports = { PackingPort };
