const { validate } = require('../../../shared/middlewares/validate.middleware');
const { createCrudRoutes } = require('../../../shared/crud/create-crud-routes');

const {
  createSchema,
  updateSchema,
  getSchema,
  listSchema
} = require('./claim-semaphore.schema');

const { claimSemaphoreController } = require('../index');

module.exports = createCrudRoutes({
  controller: claimSemaphoreController,
  validate,
  createSchema,
  updateSchema,
  getSchema,
  listSchema
});
