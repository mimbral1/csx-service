const express = require('express');

const { validate } = require('../../../shared/middlewares/validate.middleware');
const { requirePermission } = require('../../../shared/middlewares/permission.middleware');
const { createCrudRoutes } = require('../../../shared/crud/create-crud-routes');

const {
  createSchema,
  updateSchema,
  getSchema,
  listSchema
} = require('./claim-compensation.schema');

const {
  assignCompensationToClaimSchema
} = require('./claim-compensation-extra.schema');

const { claimCompensationController } = require('../index');

const router = express.Router();

const crudRoutes = createCrudRoutes({
  controller: claimCompensationController,
  validate,
  createSchema,
  updateSchema,
  getSchema,
  listSchema,
  readPermission: 'csx:claim-compensation:read',
  writePermission: 'csx:claim-compensation:write'
});

router.use('/', crudRoutes);

router.post(
  '/claim/:claimId/assign',
  requirePermission('csx:claim-compensation:assign'),
  validate(assignCompensationToClaimSchema),
  claimCompensationController.assignToClaim
);

module.exports = router;
