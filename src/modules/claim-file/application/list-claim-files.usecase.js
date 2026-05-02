const { NotFoundError } = require('../../../shared/errors/NotFoundError');

class ListClaimFilesUseCase {
  constructor({ claimRepository, claimFileRepository }) {
    this.claimRepository = claimRepository;
    this.claimFileRepository = claimFileRepository;
  }

  async execute({ claimId, filters = {}, sortBy, sortDirection, pagination }) {
    const claim = await this.claimRepository.findById(claimId);

    if (!claim) {
      throw new NotFoundError('Claim not found');
    }

    return this.claimFileRepository.findManyByClaimId({
      claimId,
      filters,
      sortBy,
      sortDirection,
      pagination
    });
  }
}

module.exports = { ListClaimFilesUseCase };
