const { NotFoundError } = require('../../../shared/errors/NotFoundError');

class ListClaimItemsUseCase {
  constructor({ claimRepository, claimItemRepository }) {
    this.claimRepository = claimRepository;
    this.claimItemRepository = claimItemRepository;
  }

  async execute({ claimId, filters = {}, sortBy, sortDirection, pagination }) {
    const claim = await this.claimRepository.findById(claimId);

    if (!claim) {
      throw new NotFoundError('Claim not found');
    }

    return this.claimItemRepository.findManyByClaimId({
      claimId,
      filters,
      sortBy,
      sortDirection,
      pagination
    });
  }
}

module.exports = { ListClaimItemsUseCase };
