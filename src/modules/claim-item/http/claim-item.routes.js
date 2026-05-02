const express = require('express');

const { validate } = require('../../../shared/middlewares/validate.middleware');
const { requirePermission } = require('../../../shared/middlewares/permission.middleware');
const {
  createClaimItemsSchema,
  updateClaimItemSchema,
  getClaimItemSchema,
  listClaimItemsSchema
} = require('./claim-item.schema');

const { claimItemController } = require('../index');

const router = express.Router();

router.get(
  '/:id/items',
  requirePermission('csx:claim-items:read'),
  validate(listClaimItemsSchema),
  claimItemController.list
);

router.post(
  '/:id/items',
  requirePermission('csx:claim-items:write'),
  validate(createClaimItemsSchema),
  claimItemController.createMany
);

router.get(
  '/:id/items/:claimItemId',
  requirePermission('csx:claim-items:read'),
  validate(getClaimItemSchema),
  claimItemController.get
);

router.put(
  '/:id/items/:claimItemId',
  requirePermission('csx:claim-items:write'),
  validate(updateClaimItemSchema),
  claimItemController.update
);

module.exports = router;
