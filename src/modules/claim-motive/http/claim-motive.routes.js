const { validate } = require('../../../shared/middlewares/validate.middleware');
const { createCrudRoutes } = require('../../../shared/crud/create-crud-routes');

const {
  createSchema,
  updateSchema,
  getSchema,
  listSchema
} = require('./claim-motive.schema');

const { claimMotiveController } = require('../index');

module.exports = createCrudRoutes({
  controller: claimMotiveController,
  validate,
  createSchema,
  updateSchema,
  getSchema,
  listSchema
});
