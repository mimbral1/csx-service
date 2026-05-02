const { NotFoundError } = require('../../../shared/errors/NotFoundError');

class RepeatClaimUseCase {
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

    const newRepetitions = Number(claim.repetitions || 0) + 1;

    const updatedClaim = await this.claimRepository.update(id, {
      repetitions: newRepetitions,
      userModified: userId || null
    });

    await this.claimHistoryRepository.create({
      claimId: id,
      changeType: 'repetition',
      oldValue: String(claim.repetitions || 0),
      newValue: String(newRepetitions),
      metadataJson: JSON.stringify({
        source: 'claim.repeat'
      }),
      userCreated: userId || null
    });

    await this.outboxService.publish({
      topic: 'csx.claim.repeated',
      eventName: 'claim.repeated',
      aggregateType: 'claim',
      aggregateId: id,
      payload: {
        id,
        displayId: claim.displayId,
        repetitions: newRepetitions,
        userModified: userId || null
      }
    });

    return updatedClaim;
  }
}

module.exports = { RepeatClaimUseCase };
