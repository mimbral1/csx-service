class CheckExpiredClaimsUseCase {
  constructor({
    claimRepository,
    claimHistoryRepository,
    outboxService
  }) {
    this.claimRepository = claimRepository;
    this.claimHistoryRepository = claimHistoryRepository;
    this.outboxService = outboxService;
  }

  async execute() {
    const expiredClaims = await this.claimRepository.findExpiredOpenClaims();

    for (const claim of expiredClaims) {
      await this.claimHistoryRepository.create({
        claimId: claim.id,
        changeType: 'sla.expired',
        oldValue: claim.slaDueDate ? claim.slaDueDate.toISOString() : null,
        newValue: 'expired',
        metadataJson: JSON.stringify({
          source: 'sla-monitor.job'
        }),
        userCreated: null
      });

      await this.outboxService.publish({
        topic: 'csx.claim.sla.expired',
        eventName: 'claim.sla.expired',
        aggregateType: 'claim',
        aggregateId: claim.id,
        payload: {
          claimId: claim.id,
          displayId: claim.displayId,
          slaDueDate: claim.slaDueDate,
          priority: claim.priority,
          statusId: claim.statusId,
          assigneeId: claim.assigneeId
        }
      });
    }

    return expiredClaims;
  }
}

module.exports = { CheckExpiredClaimsUseCase };
