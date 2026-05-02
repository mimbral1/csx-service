const { env } = require('../../config/env');
const { request } = require('../http-client');

class NotificationHttpAdapter {
  async notifyCustomer(payload) {
    return request({
      method: 'POST',
      url: `${env.NOTIFICATION_SERVICE_URL}/notifications/customer`,
      body: payload
    });
  }

  async notifyArea(payload) {
    return request({
      method: 'POST',
      url: `${env.NOTIFICATION_SERVICE_URL}/notifications/area`,
      body: payload
    });
  }

  async notifyAssignee(payload) {
    return request({
      method: 'POST',
      url: `${env.NOTIFICATION_SERVICE_URL}/notifications/assignee`,
      body: payload
    });
  }
}

module.exports = { NotificationHttpAdapter };
