const { NotFoundError } = require('../../../shared/errors/NotFoundError');
const { ValidationError } = require('../../../shared/errors/ValidationError');

class AttachClaimFileUseCase {
  constructor({
    claimRepository,
    claimFileRepository,
    claimHistoryRepository,
    outboxService
  }) {
    this.claimRepository = claimRepository;
    this.claimFileRepository = claimFileRepository;
    this.claimHistoryRepository = claimHistoryRepository;
    this.outboxService = outboxService;
  }

  async execute({ claimId, data, userId }) {
    const claim = await this.claimRepository.findById(claimId);

    if (!claim) {
      throw new NotFoundError('Claim not found');
    }

    if (!data.fileName && !data.name) {
      throw new ValidationError('fileName is required');
    }

    const file = await this.claimFileRepository.create({
      claimId,
      name: data.fileName || data.name,
      fileSource: data.fileSource || null,
      url: data.url || null,
      mimeType: data.mimeType || null,
      type: data.type || null,
      size: data.size || null,
      userCreated: userId || null,
      userModified: userId || null
    });

    await this.claimHistoryRepository.create({
      claimId,
      changeType: 'claimFile.attached',
      oldValue: null,
      newValue: file.id,
      metadataJson: JSON.stringify({
        source: 'claim-file.attach',
        fileName: file.name
      }),
      userCreated: userId || null
    });

    await this.outboxService.publish({
      topic: 'csx.claim.file.attached',
      eventName: 'claim.file.attached',
      aggregateType: 'claim',
      aggregateId: claimId,
      payload: {
        claimId,
        displayId: claim.displayId,
        file: {
          id: file.id,
          name: file.name,
          url: file.url,
          mimeType: file.mimeType,
          type: file.type,
          size: file.size
        },
        userCreated: userId || null
      }
    });

    return file;
  }
}

module.exports = { AttachClaimFileUseCase };
