const { createCrudUseCases } = require('../../shared/crud/create-crud-usecases');

const { OutboxRepository } = require('../../shared/outbox/outbox.repository');
const { OutboxService } = require('../../shared/outbox/outbox.service');

const {
  PrismaClaimStatusTransitionRepository
} = require('./infrastructure/claim-status-transition.prisma.repository');

const {
  ClaimStatusTransitionController
} = require('./http/claim-status-transition.controller');

const {
  ListPossibleTransitionsUseCase
} = require('./application/list-possible-transitions.usecase');

const { claimRepository } = require('../claim');

const repository = new PrismaClaimStatusTransitionRepository();

const outboxRepository = new OutboxRepository();
const outboxService = new OutboxService({ outboxRepository });

const {
  CreateUseCase,
  UpdateUseCase,
  GetUseCase,
  ListUseCase
} = createCrudUseCases({
  repository,
  entityName: 'claim-status-transition',
  topicPrefix: 'csx.claim-status-transition',
  outboxService
});

const listPossibleTransitionsUseCase = new ListPossibleTransitionsUseCase({
  claimRepository,
  claimStatusTransitionRepository: repository
});

const controller = new ClaimStatusTransitionController({
  createUseCase: new CreateUseCase(),
  updateUseCase: new UpdateUseCase(),
  getUseCase: new GetUseCase(),
  listUseCase: new ListUseCase(),
  listPossibleTransitionsUseCase
});

module.exports = {
  claimStatusTransitionController: controller,
  claimStatusTransitionRepository: repository
};
