const express = require('express');

const { authMiddleware } = require('../shared/middlewares/auth.middleware');

const claimRoutes = require('../modules/claim/http/claim.routes');
const claimItemRoutes = require('../modules/claim-item/http/claim-item.routes');
const claimFileRoutes = require('../modules/claim-file/http/claim-file.routes');
const claimHistoryRoutes = require('../modules/claim-history/http/claim-history.routes');

const claimStatusRoutes = require('../modules/claim-status/http/claim-status.routes');
const claimStatusTransitionRoutes = require('../modules/claim-status-transition/http/claim-status-transition.routes');

const claimTypeRoutes = require('../modules/claim-type/http/claim-type.routes');
const claimMotiveRoutes = require('../modules/claim-motive/http/claim-motive.routes');
const claimChannelRoutes = require('../modules/claim-channel/http/claim-channel.routes');
const claimCompensationRoutes = require('../modules/claim-compensation/http/claim-compensation.routes');

const claimManagementRoutes = require('../modules/claim-management/http/claim-management.routes');
const claimManagementStatusRoutes = require('../modules/claim-management-status/http/claim-management-status.routes');
const claimManagementInstanceRoutes = require('../modules/claim-management-instance/http/claim-management-instance.routes');

const claimProcessRoutes = require('../modules/claim-process/http/claim-process.routes');
const claimSemaphoreRoutes = require('../modules/claim-semaphore/http/claim-semaphore.routes');
const claimItemResolutionRoutes = require('../modules/claim-item-resolution/http/claim-item-resolution.routes');

const areaRoutes = require('../modules/area/http/area.routes');

const router = express.Router();

router.use(authMiddleware);

router.use('/claim', claimRoutes);
router.use('/claim', claimItemRoutes);
router.use('/claim', claimFileRoutes);

router.use('/claim-history', claimHistoryRoutes);

router.use('/claim-status', claimStatusRoutes);
router.use('/claim-status-transition', claimStatusTransitionRoutes);

router.use('/claim-type', claimTypeRoutes);
router.use('/claim-motive', claimMotiveRoutes);
router.use('/claim-channel', claimChannelRoutes);
router.use('/claim-compensation', claimCompensationRoutes);

router.use('/claim-management', claimManagementRoutes);
router.use('/claim-management-status', claimManagementStatusRoutes);
router.use('/', claimManagementInstanceRoutes);

router.use('/claim-process', claimProcessRoutes);
router.use('/claim-semaphore', claimSemaphoreRoutes);
router.use('/claim-item-resolution', claimItemResolutionRoutes);

router.use('/area', areaRoutes);

module.exports = router;
