const {
  ClaimManagementInstanceController
} = require('./http/claim-management-instance.controller');

const {
  PrismaClaimManagementInstanceRepository
} = require('./infrastructure/claim-management-instance.prisma.repository');

const {
  CreateClaimManagementInstanceUseCase
} = require('./application/create-claim-management-instance.usecase');

const {
  UpdateClaimManagementInstanceUseCase
} = require('./application/update-claim-management-instance.usecase');

const {
  ListClaimManagementInstancesUseCase
} = require('./application/list-claim-management-instances.usecase');

const { claimRepository } = require('../claim');

const {
  PrismaClaimHistoryRepository
} = require('../claim-history/infrastructure/claim-history.prisma.repository');

const { OutboxRepository } = require('../../shared/outbox/outbox.repository');
const { OutboxService } = require('../../shared/outbox/outbox.service');

const claimManagementInstanceRepository =
  new PrismaClaimManagementInstanceRepository();

const claimHistoryRepository = new PrismaClaimHistoryRepository();

const outboxRepository = new OutboxRepository();
const outboxService = new OutboxService({ outboxRepository });

const createClaimManagementInstanceUseCase =
  new CreateClaimManagementInstanceUseCase({
    claimRepository,
    claimManagementInstanceRepository,
    claimHistoryRepository,
    outboxService
  });

const updateClaimManagementInstanceUseCase =
  new UpdateClaimManagementInstanceUseCase({
    claimManagementInstanceRepository,
    claimHistoryRepository,
    outboxService
  });

const listClaimManagementInstancesUseCase =
  new ListClaimManagementInstancesUseCase({
    claimRepository,
    claimManagementInstanceRepository
  });

const claimManagementInstanceController =
  new ClaimManagementInstanceController({
    createClaimManagementInstanceUseCase,
    updateClaimManagementInstanceUseCase,
    listClaimManagementInstancesUseCase
  });

module.exports = {
  claimManagementInstanceController,
  claimManagementInstanceRepository
};
