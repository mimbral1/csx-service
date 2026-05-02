const express = require('express');

const { validate } = require('../../../shared/middlewares/validate.middleware');
const { requirePermission } = require('../../../shared/middlewares/permission.middleware');

const {
  createClaimManagementInstanceSchema,
  updateClaimManagementInstanceSchema,
  listClaimManagementInstancesSchema
} = require('./claim-management-instance.schema');

const {
  claimManagementInstanceController
} = require('../index');

const router = express.Router();

router.get(
  '/claim/:claimId/management',
  requirePermission('csx:claim-management:read'),
  validate(listClaimManagementInstancesSchema),
  claimManagementInstanceController.listByClaim
);

router.post(
  '/claim/:claimId/management',
  requirePermission('csx:claim-management:write'),
  validate(createClaimManagementInstanceSchema),
  claimManagementInstanceController.create
);

router.put(
  '/management/:claimManagementInstanceId',
  requirePermission('csx:claim-management:write'),
  validate(updateClaimManagementInstanceSchema),
  claimManagementInstanceController.update
);

module.exports = router;
