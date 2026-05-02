const { NotFoundError } = require('../../../shared/errors/NotFoundError');

class UpdateClaimItemUseCase {
  constructor({
    claimItemRepository,
    claimHistoryRepository,
    outboxService
  }) {
    this.claimItemRepository = claimItemRepository;
    this.claimHistoryRepository = claimHistoryRepository;
    this.outboxService = outboxService;
  }

  async execute({ claimId, claimItemId, data, userId }) {
    const existingItem = await this.claimItemRepository.findById({
      claimId,
      claimItemId
    });

    if (!existingItem) {
      throw new NotFoundError('Claim item not found');
    }

    const changes = this.buildChanges(existingItem, data);

    const updatedItem = await this.claimItemRepository.update({
      claimId,
      claimItemId,
      data: {
        ...data,
        userModified: userId || null
      }
    });

    if (changes.length > 0) {
      await this.claimHistoryRepository.create({
        claimId,
        changeType: 'claimItem.updated',
        oldValue: null,
        newValue: JSON.stringify(changes),
        metadataJson: JSON.stringify({
          source: 'claim-item.update',
          claimItemId
        }),
        userCreated: userId || null
      });

      await this.outboxService.publish({
        topic: 'csx.claim.item.updated',
        eventName: 'claim.item.updated',
        aggregateType: 'claim-item',
        aggregateId: claimItemId,
        payload: {
          claimId,
          claimItemId,
          changes,
          userModified: userId || null
        }
      });
    }

    return updatedItem;
  }

  buildChanges(existingItem, data) {
    const trackableFields = [
      'claimTypeId',
      'areaInChargeId',
      'claimItemResolutionId',
      'comment',
      'quantity',
      'price'
    ];

    const changes = [];

    for (const field of trackableFields) {
      if (!Object.prototype.hasOwnProperty.call(data, field)) {
        continue;
      }

      const oldValue = existingItem[field];
      const newValue = data[field];

      if (this.normalizeValue(oldValue) !== this.normalizeValue(newValue)) {
        changes.push({
          field,
          oldValue,
          newValue
        });
      }
    }

    return changes;
  }

  normalizeValue(value) {
    if (value === null || value === undefined) {
      return null;
    }

    return String(value);
  }
}

module.exports = { UpdateClaimItemUseCase };
