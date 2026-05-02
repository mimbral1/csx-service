const express = require('express');

const { validate } = require('../../../shared/middlewares/validate.middleware');
const { requirePermission } = require('../../../shared/middlewares/permission.middleware');
const {
  createClaimSchema,
  updateClaimSchema,
  getClaimSchema,
  listClaimsSchema,
  assignClaimSchema,
  transitionClaimSchema,
  changeClaimTypeSchema,
  idParamSchema
} = require('./claim.schema');

const { claimController } = require('../index');
const { claimStatusTransitionController } = require('../../claim-status-transition');

const router = express.Router();

router.get(
  '/',
  requirePermission('csx:claim:read'),
  validate(listClaimsSchema),
  claimController.list
);

router.post(
  '/',
  requirePermission('csx:claim:write'),
  validate(createClaimSchema),
  claimController.create
);

router.get(
  '/:id',
  requirePermission('csx:claim:read'),
  validate(getClaimSchema),
  claimController.get
);

router.put(
  '/:id',
  requirePermission('csx:claim:write'),
  validate(updateClaimSchema),
  claimController.update
);

router.post(
  '/:id/change-type',
  requirePermission('csx:claim:change-type'),
  validate(changeClaimTypeSchema),
  claimController.changeType
);

router.post(
  '/:id/assign',
  requirePermission('csx:claim:assign'),
  validate(assignClaimSchema),
  claimController.assign
);

router.post(
  '/:id/scale',
  requirePermission('csx:claim:scale'),
  validate(idParamSchema),
  claimController.scale
);

router.post(
  '/:id/repeat',
  requirePermission('csx:claim:write'),
  validate(idParamSchema),
  claimController.repeat
);

router.get(
  '/:id/action',
  requirePermission('csx:claim:read'),
  validate(idParamSchema),
  claimStatusTransitionController.listPossible
);

router.post(
  '/:id/transition',
  requirePermission('csx:claim:transition'),
  validate(transitionClaimSchema),
  claimController.transition
);

module.exports = router;
