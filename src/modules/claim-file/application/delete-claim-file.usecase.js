const { NotFoundError } = require('../../../shared/errors/NotFoundError');

class DeleteClaimFileUseCase {
  constructor({
    claimFileRepository,
    claimHistoryRepository,
    outboxService
  }) {
    this.claimFileRepository = claimFileRepository;
    this.claimHistoryRepository = claimHistoryRepository;
    this.outboxService = outboxService;
  }

  async execute({ claimId, fileId, userId }) {
    const file = await this.claimFileRepository.findById({
      claimId,
      fileId
    });

    if (!file) {
      throw new NotFoundError('Claim file not found');
    }

    await this.claimFileRepository.delete({
      claimId,
      fileId
    });

    await this.claimHistoryRepository.create({
      claimId,
      changeType: 'claimFile.deleted',
      oldValue: file.id,
      newValue: null,
      metadataJson: JSON.stringify({
        source: 'claim-file.delete',
        fileName: file.name
      }),
      userCreated: userId || null
    });

    await this.outboxService.publish({
      topic: 'csx.claim.file.deleted',
      eventName: 'claim.file.deleted',
      aggregateType: 'claim',
      aggregateId: claimId,
      payload: {
        claimId,
        fileId,
        fileName: file.name,
        userModified: userId || null
      }
    });

    return { id: fileId };
  }
}

module.exports = { DeleteClaimFileUseCase };
