const express = require('express');

const { validate } = require('../../../shared/middlewares/validate.middleware');
const { requirePermission } = require('../../../shared/middlewares/permission.middleware');

const {
  createSchema,
  updateSchema,
  getSchema,
  listSchema
} = require('./claim-status-transition.schema');

const { z } = require('zod');
const { claimStatusTransitionController } = require('../index');

const router = express.Router();

const claimIdSchema = z.object({
  body: z.any(),
  query: z.any(),
  params: z.object({
    id: z.string().min(1)
  }),
  headers: z.any()
});

router.get(
  '/',
  requirePermission('csx:claim-config:read'),
  validate(listSchema),
  claimStatusTransitionController.list
);

router.post(
  '/',
  requirePermission('csx:claim-config:write'),
  validate(createSchema),
  claimStatusTransitionController.create
);

router.get(
  '/claim/:id/action',
  requirePermission('csx:claim:read'),
  validate(claimIdSchema),
  claimStatusTransitionController.listPossible
);

router.get(
  '/:id',
  requirePermission('csx:claim-config:read'),
  validate(getSchema),
  claimStatusTransitionController.get
);

router.put(
  '/:id',
  requirePermission('csx:claim-config:write'),
  validate(updateSchema),
  claimStatusTransitionController.update
);

module.exports = router;
