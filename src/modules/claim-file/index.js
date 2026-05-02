const { ClaimFileController } = require('./http/claim-file.controller');

const { PrismaClaimFileRepository } = require('./infrastructure/claim-file.prisma.repository');

const { AttachClaimFileUseCase } = require('./application/attach-claim-file.usecase');
const { GetClaimFileUseCase } = require('./application/get-claim-file.usecase');
const { ListClaimFilesUseCase } = require('./application/list-claim-files.usecase');
const { DeleteClaimFileUseCase } = require('./application/delete-claim-file.usecase');

const { claimRepository } = require('../claim');
const { PrismaClaimHistoryRepository } = require('../claim-history/infrastructure/claim-history.prisma.repository');

const { OutboxRepository } = require('../../shared/outbox/outbox.repository');
const { OutboxService } = require('../../shared/outbox/outbox.service');

const claimFileRepository = new PrismaClaimFileRepository();
const claimHistoryRepository = new PrismaClaimHistoryRepository();

const outboxRepository = new OutboxRepository();
const outboxService = new OutboxService({ outboxRepository });

const attachClaimFileUseCase = new AttachClaimFileUseCase({
  claimRepository,
  claimFileRepository,
  claimHistoryRepository,
  outboxService
});

const getClaimFileUseCase = new GetClaimFileUseCase({
  claimFileRepository
});

const listClaimFilesUseCase = new ListClaimFilesUseCase({
  claimRepository,
  claimFileRepository
});

const deleteClaimFileUseCase = new DeleteClaimFileUseCase({
  claimFileRepository,
  claimHistoryRepository,
  outboxService
});

const claimFileController = new ClaimFileController({
  attachClaimFileUseCase,
  getClaimFileUseCase,
  listClaimFilesUseCase,
  deleteClaimFileUseCase
});

module.exports = {
  claimFileController,
  claimFileRepository
};
