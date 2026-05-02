const { PrismaClaimRepository } = require('./infrastructure/claim.prisma.repository');
const { ClaimController } = require('./http/claim.controller');

const { CreateClaimUseCase } = require('./application/create-claim.usecase');
const { UpdateClaimUseCase } = require('./application/update-claim.usecase');
const { GetClaimUseCase } = require('./application/get-claim.usecase');
const { ListClaimsUseCase } = require('./application/list-claims.usecase');
const { AssignClaimUseCase } = require('./application/assign-claim.usecase');
const { ScaleClaimUseCase } = require('./application/scale-claim.usecase');
const { RepeatClaimUseCase } = require('./application/repeat-claim.usecase');
const { TransitionClaimUseCase } = require('./application/transition-claim.usecase');
const { ChangeClaimTypeUseCase } = require('./application/change-claim-type.usecase');

const { PrismaClaimHistoryRepository } = require('../claim-history/infrastructure/claim-history.prisma.repository');
const { PrismaClaimStatusTransitionRepository } = require('../claim-status-transition/infrastructure/claim-status-transition.prisma.repository');

const { OutboxService } = require('../../shared/outbox/outbox.service');
const { OutboxRepository } = require('../../shared/outbox/outbox.repository');

const claimRepository = new PrismaClaimRepository();
const claimHistoryRepository = new PrismaClaimHistoryRepository();
const claimStatusTransitionRepository = new PrismaClaimStatusTransitionRepository();

const outboxRepository = new OutboxRepository();
const outboxService = new OutboxService({ outboxRepository });

const createClaimUseCase = new CreateClaimUseCase({
  claimRepository,
  claimHistoryRepository,
  outboxService
});

const updateClaimUseCase = new UpdateClaimUseCase({
  claimRepository,
  claimHistoryRepository,
  outboxService
});

const getClaimUseCase = new GetClaimUseCase({
  claimRepository
});

const listClaimsUseCase = new ListClaimsUseCase({
  claimRepository
});

const assignClaimUseCase = new AssignClaimUseCase({
  claimRepository,
  claimHistoryRepository,
  outboxService
});

const scaleClaimUseCase = new ScaleClaimUseCase({
  claimRepository,
  claimHistoryRepository,
  outboxService
});

const repeatClaimUseCase = new RepeatClaimUseCase({
  claimRepository,
  claimHistoryRepository,
  outboxService
});

const transitionClaimUseCase = new TransitionClaimUseCase({
  claimRepository,
  claimStatusTransitionRepository,
  claimHistoryRepository,
  outboxService
});

const changeClaimTypeUseCase = new ChangeClaimTypeUseCase();

const claimController = new ClaimController({
  createClaimUseCase,
  updateClaimUseCase,
  getClaimUseCase,
  listClaimsUseCase,
  assignClaimUseCase,
  scaleClaimUseCase,
  repeatClaimUseCase,
  transitionClaimUseCase,
  changeClaimTypeUseCase
});

module.exports = {
  claimController,
  claimRepository
};
