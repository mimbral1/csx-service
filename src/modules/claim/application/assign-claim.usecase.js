const { NotFoundError } = require('../../../shared/errors/NotFoundError');
const { ValidationError } = require('../../../shared/errors/ValidationError');

class AssignClaimUseCase {
  constructor({ claimRepository, claimHistoryRepository, outboxService }) {
    this.claimRepository = claimRepository;
    this.claimHistoryRepository = claimHistoryRepository;
    this.outboxService = outboxService;
  }

  async execute({ id, assigneeId, userId }) {
    if (!assigneeId) {
      throw new ValidationError('assigneeId is required');
    }

    const claim = await this.claimRepository.findById(id);

    if (!claim) {
      throw new NotFoundError('Claim not found');
    }

    const updatedClaim = await this.claimRepository.update(id, {
      assigneeId,
      userModified: userId || null
    });

    await this.claimHistoryRepository.create({
      claimId: id,
      changeType: 'assigneeId',
      oldValue: claim.assigneeId || null,
      newValue: assigneeId,
      metadataJson: JSON.stringify({
        source: 'claim.assign'
      }),
      userCreated: userId || null
    });

    await this.outboxService.publish({
      topic: 'csx.claim.assigned',
      eventName: 'claim.assigned',
      aggregateType: 'claim',
      aggregateId: id,
      payload: {
        id,
        displayId: claim.displayId,
        oldAssigneeId: claim.assigneeId || null,
        assigneeId,
        userModified: userId || null
      }
    });

    return updatedClaim;
  }
}

module.exports = { AssignClaimUseCase };
