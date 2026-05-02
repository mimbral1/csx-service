const { env } = require('../config/env');

const { OmsMockAdapter } = require('./oms/oms.mock.adapter');
const { OmsHttpAdapter } = require('./oms/oms.http.adapter');

const { InventoryMockAdapter } = require('./inventory/inventory.mock.adapter');
const { InventoryHttpAdapter } = require('./inventory/inventory.http.adapter');

const { PackingMockAdapter } = require('./packing/packing.mock.adapter');
const { PackingHttpAdapter } = require('./packing/packing.http.adapter');

const { DeliveryMockAdapter } = require('./delivery/delivery.mock.adapter');
const { DeliveryHttpAdapter } = require('./delivery/delivery.http.adapter');

const { FinanceMockAdapter } = require('./finance/finance.mock.adapter');
const { FinanceHttpAdapter } = require('./finance/finance.http.adapter');

const { NotificationMockAdapter } = require('./notification/notification.mock.adapter');
const { NotificationHttpAdapter } = require('./notification/notification.http.adapter');

const isHttp = env.INTEGRATIONS_MODE === 'http';

const integrations = {
  oms: isHttp ? new OmsHttpAdapter() : new OmsMockAdapter(),
  inventory: isHttp ? new InventoryHttpAdapter() : new InventoryMockAdapter(),
  packing: isHttp ? new PackingHttpAdapter() : new PackingMockAdapter(),
  delivery: isHttp ? new DeliveryHttpAdapter() : new DeliveryMockAdapter(),
  finance: isHttp ? new FinanceHttpAdapter() : new FinanceMockAdapter(),
  notification: isHttp
    ? new NotificationHttpAdapter()
    : new NotificationMockAdapter()
};

module.exports = { integrations };
