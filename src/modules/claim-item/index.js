const { ClaimItemController } = require('./http/claim-item.controller');
const { PrismaClaimItemRepository } = require('./infrastructure/claim-item.prisma.repository');

const { CreateManyClaimItemsUseCase } = require('./application/create-many-claim-items.usecase');
const { UpdateClaimItemUseCase } = require('./application/update-claim-item.usecase');
const { GetClaimItemUseCase } = require('./application/get-claim-item.usecase');
const { ListClaimItemsUseCase } = require('./application/list-claim-items.usecase');

const { claimRepository } = require('../claim');
const { PrismaClaimHistoryRepository } = require('../claim-history/infrastructure/claim-history.prisma.repository');

const { OutboxRepository } = require('../../shared/outbox/outbox.repository');
const { OutboxService } = require('../../shared/outbox/outbox.service');

const claimItemRepository = new PrismaClaimItemRepository();
const claimHistoryRepository = new PrismaClaimHistoryRepository();

const outboxRepository = new OutboxRepository();
const outboxService = new OutboxService({ outboxRepository });

const createManyClaimItemsUseCase = new CreateManyClaimItemsUseCase({
  claimRepository,
  claimItemRepository,
  claimHistoryRepository,
  outboxService
});

const updateClaimItemUseCase = new UpdateClaimItemUseCase({
  claimItemRepository,
  claimHistoryRepository,
  outboxService
});

const getClaimItemUseCase = new GetClaimItemUseCase({
  claimItemRepository
});

const listClaimItemsUseCase = new ListClaimItemsUseCase({
  claimRepository,
  claimItemRepository
});

const claimItemController = new ClaimItemController({
  createManyClaimItemsUseCase,
  updateClaimItemUseCase,
  getClaimItemUseCase,
  listClaimItemsUseCase
});

module.exports = {
  claimItemController,
  claimItemRepository
};
