const { createCrudRepository } = require('../../shared/crud/create-crud-repository');
const { createCrudUseCases } = require('../../shared/crud/create-crud-usecases');
const { createCrudController } = require('../../shared/crud/create-crud-controller');

const { OutboxRepository } = require('../../shared/outbox/outbox.repository');
const { OutboxService } = require('../../shared/outbox/outbox.service');

const repository = createCrudRepository({
  modelName: 'claimSemaphore',
  searchableFields: ['name']
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
  entityName: 'claim-semaphore',
  topicPrefix: 'csx.claim-semaphore',
  outboxService
});

const controller = createCrudController({
  createUseCase: new CreateUseCase(),
  updateUseCase: new UpdateUseCase(),
  getUseCase: new GetUseCase(),
  listUseCase: new ListUseCase()
});

module.exports = {
  claimSemaphoreController: controller,
  claimSemaphoreRepository: repository
};
