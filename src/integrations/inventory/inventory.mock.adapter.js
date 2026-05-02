class InventoryMockAdapter {
  async getAvailableStock({ sku, storeId }) {
    return {
      sku,
      storeId,
      available: 10
    };
  }

  async reserveStock(payload) {
    return {
      reservationId: `mock-reservation-${Date.now()}`,
      status: 'reserved',
      payload
    };
  }

  async releaseReservation(payload) {
    return {
      status: 'released',
      payload
    };
  }
}

module.exports = { InventoryMockAdapter };
