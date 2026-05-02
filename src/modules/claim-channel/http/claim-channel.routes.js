const { validate } = require('../../../shared/middlewares/validate.middleware');
const { createCrudRoutes } = require('../../../shared/crud/create-crud-routes');

const {
  createSchema,
  updateSchema,
  getSchema,
  listSchema
} = require('./claim-channel.schema');

const { claimChannelController } = require('../index');

module.exports = createCrudRoutes({
  controller: claimChannelController,
  validate,
  createSchema,
  updateSchema,
  getSchema,
  listSchema
});
