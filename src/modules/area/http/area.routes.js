const { validate } = require('../../../shared/middlewares/validate.middleware');
const { createCrudRoutes } = require('../../../shared/crud/create-crud-routes');

const {
  createSchema,
  updateSchema,
  getSchema,
  listSchema
} = require('./area.schema');

const { areaController } = require('../index');

module.exports = createCrudRoutes({
  controller: areaController,
  validate,
  createSchema,
  updateSchema,
  getSchema,
  listSchema
});
