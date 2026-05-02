const { NotFoundError } = require('../../../shared/errors/NotFoundError');

class ScaleClaimUseCase {
  constructor({ claimRepository, claimHistoryRepository, outboxService }) {
    this.claimRepository = claimRepository;
    this.claimHistoryRepository = claimHistoryRepository;
    this.outboxService = outboxService;
  }

  async execute({ id, userId }) {
    const claim = await this.claimRepository.findById(id);

    if (!claim) {
      throw new NotFoundError('Claim not found');
    }

    if (claim.escalated === true) {
      return claim;
    }

    const updatedClaim = await this.claimRepository.update(id, {
      escalated: true,
      userModified: userId || null
    });

    await this.claimHistoryRepository.create({
      claimId: id,
      changeType: 'escalated',
      oldValue: 'false',
      newValue: 'true',
      metadataJson: JSON.stringify({
        source: 'claim.scale'
      }),
      userCreated: userId || null
    });

    await this.outboxService.publish({
      topic: 'csx.claim.escalated',
      eventName: 'claim.escalated',
      aggregateType: 'claim',
      aggregateId: id,
      payload: {
        id,
        displayId: claim.displayId,
        escalated: true,
        userModified: userId || null
      }
    });

    return updatedClaim;
  }
}

module.exports = { ScaleClaimUseCase };
