const { validate } = require('../../../shared/middlewares/validate.middleware');
const { createCrudRoutes } = require('../../../shared/crud/create-crud-routes');

const {
  createSchema,
  updateSchema,
  getSchema,
  listSchema
} = require('./claim-management.schema');

const { claimManagementController } = require('../index');

module.exports = createCrudRoutes({
  controller: claimManagementController,
  validate,
  createSchema,
  updateSchema,
  getSchema,
  listSchema,
  readPermission: 'csx:claim-management:read',
  writePermission: 'csx:claim-management:write'
});
