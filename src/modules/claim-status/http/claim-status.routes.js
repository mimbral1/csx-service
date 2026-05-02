const { validate } = require('../../../shared/middlewares/validate.middleware');
const { createCrudRoutes } = require('../../../shared/crud/create-crud-routes');

const {
  createSchema,
  updateSchema,
  getSchema,
  listSchema
} = require('./claim-status.schema');

const { claimStatusController } = require('../index');

module.exports = createCrudRoutes({
  controller: claimStatusController,
  validate,
  createSchema,
  updateSchema,
  getSchema,
  listSchema
});
