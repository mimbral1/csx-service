const { NotFoundError } = require('../../../shared/errors/NotFoundError');

class GetClaimUseCase {
  constructor({ claimRepository }) {
    this.claimRepository = claimRepository;
  }

  async execute({ id }) {
    const claim = await this.claimRepository.findById(id);

    if (!claim) {
      throw new NotFoundError('Claim not found');
    }

    return claim;
  }
}

module.exports = { GetClaimUseCase };
