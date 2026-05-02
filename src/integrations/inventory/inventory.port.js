class InventoryPort {
  async getAvailableStock({ sku, storeId }) {
    throw new Error('Not implemented');
  }

  async reserveStock(payload) {
    throw new Error('Not implemented');
  }

  async releaseReservation(payload) {
    throw new Error('Not implemented');
  }
}

module.exports = { InventoryPort };
