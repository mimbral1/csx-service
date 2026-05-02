const { NotFoundError } = require('../../../shared/errors/NotFoundError');

class GetClaimFileUseCase {
  constructor({ claimFileRepository }) {
    this.claimFileRepository = claimFileRepository;
  }

  async execute({ claimId, fileId }) {
    const file = await this.claimFileRepository.findById({
      claimId,
      fileId
    });

    if (!file) {
      throw new NotFoundError('Claim file not found');
    }

    return file;
  }
}

module.exports = { GetClaimFileUseCase };
