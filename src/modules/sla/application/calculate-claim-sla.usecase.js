const { addSlaToDate } = require('../../../shared/utils/date');

class CalculateClaimSlaUseCase {
  constructor({ claimTypeRepository }) {
    this.claimTypeRepository = claimTypeRepository;
  }

  async execute({ claimTypeId, baseDate = new Date() }) {
    const claimType = await this.claimTypeRepository.findById(claimTypeId);

    if (!claimType || !claimType.sla || !claimType.slaMeasuredIn) {
      return null;
    }

    return addSlaToDate(baseDate, claimType.sla, claimType.slaMeasuredIn);
  }
}

module.exports = { CalculateClaimSlaUseCase };
