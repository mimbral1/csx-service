const express = require('express');

const { validate } = require('../../../shared/middlewares/validate.middleware');
const { requirePermission } = require('../../../shared/middlewares/permission.middleware');
const { listClaimHistorySchema } = require('./claim-history.schema');
const { claimHistoryController } = require('../index');

const router = express.Router();

router.get(
  '/',
  requirePermission('csx:claim:read'),
  validate(listClaimHistorySchema),
  claimHistoryController.list
);

module.exports = router;
