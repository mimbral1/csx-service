const { NotFoundError } = require('../../../shared/errors/NotFoundError');

class GetClaimItemUseCase {
  constructor({ claimItemRepository }) {
    this.claimItemRepository = claimItemRepository;
  }

  async execute({ claimId, claimItemId }) {
    const item = await this.claimItemRepository.findById({
      claimId,
      claimItemId
    });

    if (!item) {
      throw new NotFoundError('Claim item not found');
    }

    return item;
  }
}

module.exports = { GetClaimItemUseCase };
