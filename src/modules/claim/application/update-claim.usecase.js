const { NotFoundError } = require('../../../shared/errors/NotFoundError');
const { ValidationError } = require('../../../shared/errors/ValidationError');

class UpdateClaimUseCase {
  constructor({
    claimRepository,
    claimHistoryRepository,
    outboxService
  }) {
    this.claimRepository = claimRepository;
    this.claimHistoryRepository = claimHistoryRepository;
    this.outboxService = outboxService;
  }

  async execute({ id, data, userId }) {
    const existingClaim = await this.claimRepository.findById(id);

    if (!existingClaim) {
      throw new NotFoundError('Claim not found');
    }

    this.validateUpdatableFields(data);

    const changes = this.buildChanges(existingClaim, data);

    if (changes.length === 0) {
      return existingClaim;
    }

    const updatedClaim = await this.claimRepository.update(id, {
      ...data,
      userModified: userId || null
    });

    await this.claimHistoryRepository.createMany(
      changes.map(change => ({
        claimId: id,
        changeType: change.field,
        oldValue: this.stringifyValue(change.oldValue),
        newValue: this.stringifyValue(change.newValue),
        metadataJson: JSON.stringify({
          source: 'claim.update',
          field: change.field
        }),
        userCreated: userId || null
      }))
    );

    await this.outboxService.publish({
      topic: 'csx.claim.updated',
      eventName: 'claim.updated',
      aggregateType: 'claim',
      aggregateId: id,
      payload: {
        id: updatedClaim.id,
        displayId: updatedClaim.displayId,
        changes,
        userModified: userId || null,
        dateModified: updatedClaim.dateModified
      }
    });

    return updatedClaim;
  }

  validateUpdatableFields(data) {
    const forbiddenFields = [
      'id',
      'displayId',
      'dateCreated',
      'userCreated'
    ];

    for (const field of forbiddenFields) {
      if (Object.prototype.hasOwnProperty.call(data, field)) {
        throw new ValidationError(`Field ${field} cannot be updated`);
      }
    }

    if (data.priority) {
      const allowedPriorities = [
        'noPriority',
        'low',
        'medium',
        'high',
        'urgent'
      ];

      if (!allowedPriorities.includes(data.priority)) {
        throw new ValidationError('Invalid claim priority');
      }
    }
  }

  buildChanges(existingClaim, data) {
    const fieldsToTrack = [
      'channelId',
      'motiveId',
      'orderId',
      'storeId',
      'customerId',
      'escalated',
      'assigneeId',
      'slaDueDate',
      'priority',
      'statusId'
    ];

    const changes = [];

    for (const field of fieldsToTrack) {
      if (!Object.prototype.hasOwnProperty.call(data, field)) {
        continue;
      }

      const oldValue = existingClaim[field];
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
    if (value instanceof Date) {
      return value.toISOString();
    }

    if (value === null || value === undefined) {
      return null;
    }

    return String(value);
  }

  stringifyValue(value) {
    if (value instanceof Date) {
      return value.toISOString();
    }

    if (value === null || value === undefined) {
      return null;
    }

    if (typeof value === 'object') {
      return JSON.stringify(value);
    }

    return String(value);
  }
}

module.exports = { UpdateClaimUseCase };
