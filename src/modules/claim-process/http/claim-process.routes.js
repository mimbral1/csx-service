const { validate } = require('../../../shared/middlewares/validate.middleware');
const { createCrudRoutes } = require('../../../shared/crud/create-crud-routes');

const {
  createSchema,
  updateSchema,
  getSchema,
  listSchema
} = require('./claim-process.schema');

const { claimProcessController } = require('../index');

module.exports = createCrudRoutes({
  controller: claimProcessController,
  validate,
  createSchema,
  updateSchema,
  getSchema,
  listSchema
});
