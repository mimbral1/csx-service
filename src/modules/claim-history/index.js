const { PrismaClaimHistoryRepository } = require('./infrastructure/claim-history.prisma.repository');
const { ListClaimHistoryUseCase } = require('./application/list-claim-history.usecase');
const { ClaimHistoryController } = require('./http/claim-history.controller');

const claimHistoryRepository = new PrismaClaimHistoryRepository();

const listClaimHistoryUseCase = new ListClaimHistoryUseCase({
  claimHistoryRepository
});

const claimHistoryController = new ClaimHistoryController({
  listClaimHistoryUseCase
});

module.exports = {
  claimHistoryRepository,
  claimHistoryController
};
