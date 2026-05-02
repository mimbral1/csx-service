class NotificationMockAdapter {
  async notifyCustomer(payload) {
    return {
      ok: true,
      channel: 'mock-customer-notification',
      payload
    };
  }

  async notifyArea(payload) {
    return {
      ok: true,
      channel: 'mock-area-notification',
      payload
    };
  }

  async notifyAssignee(payload) {
    return {
      ok: true,
      channel: 'mock-assignee-notification',
      payload
    };
  }
}

module.exports = { NotificationMockAdapter };
