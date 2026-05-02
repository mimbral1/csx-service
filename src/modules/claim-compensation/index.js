const { createCrudRepository } = require('../../shared/crud/create-crud-repository');
const { createCrudUseCases } = require('../../shared/crud/create-crud-usecases');
const { createCrudController } = require('../../shared/crud/create-crud-controller');

const { OutboxRepository } = require('../../shared/outbox/outbox.repository');
const { OutboxService } = require('../../shared/outbox/outbox.service');

const {
  AssignCompensationToClaimUseCase
} = require('./application/assign-compensation-to-claim.usecase');

const { claimRepository } = require('../claim');
const {
  PrismaClaimHistoryRepository
} = require('../claim-history/infrastructure/claim-history.prisma.repository');

const repository = createCrudRepository({
  modelName: 'claimCompensation',
  searchableFields: ['name', 'description']
});

const outboxRepository = new OutboxRepository();
const outboxService = new OutboxService({ outboxRepository });

const {
  CreateUseCase,
  UpdateUseCase,
  GetUseCase,
  ListUseCase
} = createCrudUseCases({
  repository,
  entityName: 'claim-compensation',
  topicPrefix: 'csx.claim-compensation',
  outboxService
});

const controller = createCrudController({
  createUseCase: new CreateUseCase(),
  updateUseCase: new UpdateUseCase(),
  getUseCase: new GetUseCase(),
  listUseCase: new ListUseCase()
});

const claimHistoryRepository = new PrismaClaimHistoryRepository();

const assignCompensationToClaimUseCase = new AssignCompensationToClaimUseCase({
  claimRepository,
  claimHistoryRepository,
  outboxService
});

controller.assignToClaim = async (req, res, next) => {
  try {
    const assignment = await assignCompensationToClaimUseCase.execute({
      claimId: req.validated.params.claimId,
      data: req.validated.body,
      userId: req.headers['x-user-id'] || null
    });

    res.status(200).json({
      id: assignment.id
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  claimCompensationController: controller,
  claimCompensationRepository: repository
};
