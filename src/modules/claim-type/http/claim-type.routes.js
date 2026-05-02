const { validate } = require('../../../shared/middlewares/validate.middleware');
const { createCrudRoutes } = require('../../../shared/crud/create-crud-routes');

const {
  createSchema,
  updateSchema,
  getSchema,
  listSchema
} = require('./claim-type.schema');

const { claimTypeController } = require('../index');

module.exports = createCrudRoutes({
  controller: claimTypeController,
  validate,
  createSchema,
  updateSchema,
  getSchema,
  listSchema
});
