const { NotFoundError } = require('../errors/NotFoundError');

function createCrudUseCases({ repository, entityName, outboxService, topicPrefix }) {
  class CreateUseCase {
    async execute({ data, userId }) {
      const created = await repository.create({
        ...data,
        userCreated: userId || null,
        userModified: userId || null
      });

      if (outboxService && topicPrefix) {
        await outboxService.publish({
          topic: `${topicPrefix}.created`,
          eventName: `${entityName}.created`,
          aggregateType: entityName,
          aggregateId: created.id,
          payload: created
        });
      }

      return created;
    }
  }

  class UpdateUseCase {
    async execute({ id, data, userId }) {
      const existing = await repository.findById(id);

      if (!existing) {
        throw new NotFoundError(`${entityName} not found`);
      }

      const updated = await repository.update(id, {
        ...data,
        userModified: userId || null
      });

      if (outboxService && topicPrefix) {
        await outboxService.publish({
          topic: `${topicPrefix}.updated`,
          eventName: `${entityName}.updated`,
          aggregateType: entityName,
          aggregateId: id,
          payload: updated
        });
      }

      return updated;
    }
  }

  class GetUseCase {
    async execute({ id }) {
      const entity = await repository.findById(id);

      if (!entity) {
        throw new NotFoundError(`${entityName} not found`);
      }

      return entity;
    }
  }

  class ListUseCase {
    async execute({ filters = {}, sortBy, sortDirection, pagination }) {
      return repository.findMany({
        filters,
        sortBy,
        sortDirection,
        pagination
      });
    }
  }

  return {
    CreateUseCase,
    UpdateUseCase,
    GetUseCase,
    ListUseCase
  };
}

module.exports = { createCrudUseCases };
