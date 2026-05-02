class ListClaimHistoryUseCase {
  constructor({ claimHistoryRepository }) {
    this.claimHistoryRepository = claimHistoryRepository;
  }

  async execute({ filters = {}, sortBy, sortDirection, pagination }) {
    return this.claimHistoryRepository.findMany({
      filters,
      sortBy,
      sortDirection,
      pagination
    });
  }
}

module.exports = { ListClaimHistoryUseCase };
