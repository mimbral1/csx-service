const express = require('express');

const { validate } = require('../../../shared/middlewares/validate.middleware');
const { requirePermission } = require('../../../shared/middlewares/permission.middleware');

const {
  attachClaimFileSchema,
  listClaimFilesSchema,
  getClaimFileSchema
} = require('./claim-file.schema');

const { claimFileController } = require('../index');

const router = express.Router();

router.get(
  '/:id/file',
  requirePermission('csx:claim-file:read'),
  validate(listClaimFilesSchema),
  claimFileController.list
);

router.post(
  '/:id/file',
  requirePermission('csx:claim-file:write'),
  validate(attachClaimFileSchema),
  claimFileController.attach
);

router.get(
  '/:id/file/:fileId',
  requirePermission('csx:claim-file:read'),
  validate(getClaimFileSchema),
  claimFileController.get
);

router.delete(
  '/:id/file/:fileId',
  requirePermission('csx:claim-file:delete'),
  validate(getClaimFileSchema),
  claimFileController.delete
);

module.exports = router;
