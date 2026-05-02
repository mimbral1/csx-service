class NotificationPort {
  async notifyCustomer(payload) {
    throw new Error('Not implemented');
  }

  async notifyArea(payload) {
    throw new Error('Not implemented');
  }

  async notifyAssignee(payload) {
    throw new Error('Not implemented');
  }
}

module.exports = { NotificationPort };
