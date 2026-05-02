const { createCrudUseCases } = require('../../shared/crud/create-crud-usecases');
const { createCrudController } = require('../../shared/crud/create-crud-controller');

const { PrismaClaimTypeRepository } = require('./infrastructure/claim-type.prisma.repository');

const { OutboxRepository } = require('../../shared/outbox/outbox.repository');
const { OutboxService } = require('../../shared/outbox/outbox.service');

const repository = new PrismaClaimTypeRepository();

const outboxRepository = new OutboxRepository();
const outboxService = new OutboxService({ outboxRepository });

const {
  CreateUseCase,
  UpdateUseCase,
  GetUseCase,
  ListUseCase
} = createCrudUseCases({
  repository,
  entityName: 'claim-type',
  topicPrefix: 'csx.claim-type',
  outboxService
});

const controller = createCrudController({
  createUseCase: new CreateUseCase(),
  updateUseCase: new UpdateUseCase(),
  getUseCase: new GetUseCase(),
  listUseCase: new ListUseCase()
});

module.exports = {
  claimTypeController: controller,
  claimTypeRepository: repository
};
