const express = require('express');
const { requirePermission } = require('../middlewares/permission.middleware');

function createCrudRoutes({
  controller,
  validate,
  createSchema,
  updateSchema,
  getSchema,
  listSchema,
  readPermission = 'csx:claim-config:read',
  writePermission = 'csx:claim-config:write'
}) {
  const router = express.Router();

  router.get('/', requirePermission(readPermission), validate(listSchema), controller.list);
  router.post('/', requirePermission(writePermission), validate(createSchema), controller.create);

  router.get('/:id', requirePermission(readPermission), validate(getSchema), controller.get);
  router.put('/:id', requirePermission(writePermission), validate(updateSchema), controller.update);

  return router;
}

module.exports = { createCrudRoutes };
