const { validate } = require('../../../shared/middlewares/validate.middleware');
const { createCrudRoutes } = require('../../../shared/crud/create-crud-routes');

const {
  createSchema,
  updateSchema,
  getSchema,
  listSchema
} = require('./claim-item-resolution.schema');

const { claimItemResolutionController } = require('../index');

module.exports = createCrudRoutes({
  controller: claimItemResolutionController,
  validate,
  createSchema,
  updateSchema,
  getSchema,
  listSchema
});
