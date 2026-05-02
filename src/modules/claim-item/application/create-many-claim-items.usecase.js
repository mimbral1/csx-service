const { NotFoundError } = require('../../../shared/errors/NotFoundError');
const { ValidationError } = require('../../../shared/errors/ValidationError');

class CreateManyClaimItemsUseCase {
  constructor({
    claimRepository,
    claimItemRepository,
    claimHistoryRepository,
    outboxService
  }) {
    this.claimRepository = claimRepository;
    this.claimItemRepository = claimItemRepository;
    this.claimHistoryRepository = claimHistoryRepository;
    this.outboxService = outboxService;
  }

  async execute({ claimId, data, userId }) {
    const claim = await this.claimRepository.findById(claimId);

    if (!claim) {
      throw new NotFoundError('Claim not found');
    }

    const itemsToCreate = this.normalizeItems({ claimId, data, userId });

    const createdItems = await this.claimItemRepository.createMany(itemsToCreate);

    await this.claimHistoryRepository.create({
      claimId,
      changeType: 'claimItems',
      oldValue: null,
      newValue: JSON.stringify(createdItems.map(item => item.id)),
      metadataJson: JSON.stringify({
        source: 'claim-item.create-many',
        totalItems: createdItems.length
      }),
      userCreated: userId || null
    });

    await this.outboxService.publish({
      topic: 'csx.claim.item.created',
      eventName: 'claim.item.created',
      aggregateType: 'claim',
      aggregateId: claimId,
      payload: {
        claimId,
        displayId: claim.displayId,
        items: createdItems.map(item => ({
          id: item.id,
          type: item.type,
          typeId: item.typeId,
          orderId: item.orderId,
          claimTypeId: item.claimTypeId,
          claimItemResolutionId: item.claimItemResolutionId,
          areaInChargeId: item.areaInChargeId,
          quantity: item.quantity,
          price: item.price
        })),
        userCreated: userId || null
      }
    });

    return createdItems;
  }

  normalizeItems({ claimId, data, userId }) {
    if (Array.isArray(data.items) && data.items.length > 0) {
      return data.items.map(item => ({
        claimId,
        type: 'item',
        typeId: item.itemId,
        orderId: data.orderId || null,
        claimTypeId: item.claimTypeId || data.claimTypeId,
        claimItemResolutionId:
          item.claimItemResolutionId || data.claimItemResolutionId,
        areaInChargeId: item.areaInChargeId || data.areaInChargeId || null,
        comment: item.comment || data.comment || null,
        quantity: item.quantity || data.quantity || null,
        price: item.price || data.price || null,
        userCreated: userId || null,
        userModified: userId || null
      }));
    }

    if (!data.type || !data.typeId) {
      throw new ValidationError('type and typeId are required');
    }

    return [
      {
        claimId,
        type: data.type,
        typeId: data.typeId,
        orderId: data.orderId || null,
        claimTypeId: data.claimTypeId,
        claimItemResolutionId: data.claimItemResolutionId,
        areaInChargeId: data.areaInChargeId || null,
        comment: data.comment || null,
        quantity: data.quantity || null,
        price: data.price || null,
        userCreated: userId || null,
        userModified: userId || null
      }
    ];
  }
}

module.exports = { CreateManyClaimItemsUseCase };
