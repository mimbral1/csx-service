const { NotFoundError } = require('../../../shared/errors/NotFoundError');

class ListClaimManagementInstancesUseCase {
  constructor({
    claimRepository,
    claimManagementInstanceRepository
  }) {
    this.claimRepository = claimRepository;
    this.claimManagementInstanceRepository = claimManagementInstanceRepository;
  }

  async execute({ claimId, filters = {}, sortBy, sortDirection, pagination }) {
    const claim = await this.claimRepository.findById(claimId);

    if (!claim) {
      throw new NotFoundError('Claim not found');
    }

    return this.claimManagementInstanceRepository.findManyByClaimId({
      claimId,
      filters,
      sortBy,
      sortDirection,
      pagination
    });
  }
}

module.exports = { ListClaimManagementInstancesUseCase };
