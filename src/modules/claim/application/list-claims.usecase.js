class ListClaimsUseCase {
  constructor({ claimRepository }) {
    this.claimRepository = claimRepository;
  }

  async execute({ filters = {}, sortBy, sortDirection, pagination }) {
    return this.claimRepository.findMany({
      filters,
      sortBy,
      sortDirection,
      pagination
    });
  }
}

module.exports = { ListClaimsUseCase };
