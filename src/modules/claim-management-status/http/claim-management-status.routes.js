const { validate } = require('../../../shared/middlewares/validate.middleware');
const { createCrudRoutes } = require('../../../shared/crud/create-crud-routes');

const {
  createSchema,
  updateSchema,
  getSchema,
  listSchema
} = require('./claim-management-status.schema');

const { claimManagementStatusController } = require('../index');

module.exports = createCrudRoutes({
  controller: claimManagementStatusController,
  validate,
  createSchema,
  updateSchema,
  getSchema,
  listSchema,
  readPermission: 'csx:claim-management:read',
  writePermission: 'csx:claim-management:write'
});
