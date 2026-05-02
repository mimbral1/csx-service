class GetClaimSlaStatusUseCase {
  constructor({ claimSemaphoreRepository }) {
    this.claimSemaphoreRepository = claimSemaphoreRepository;
  }

  async execute({ claim }) {
    if (!claim.slaDueDate) {
      return {
        status: 'without_sla',
        semaphore: null,
        minutesRemaining: null,
        percentRemaining: null
      };
    }

    const now = new Date();
    const dueDate = new Date(claim.slaDueDate);

    const diffMs = dueDate.getTime() - now.getTime();
    const minutesRemaining = Math.floor(diffMs / 1000 / 60);

    if (minutesRemaining < 0) {
      return {
        status: 'expired',
        semaphore: {
          name: 'Vencido',
          color: '#DC2626',
          alerts: true
        },
        minutesRemaining,
        percentRemaining: 0
      };
    }

    const semaphores = await this.claimSemaphoreRepository.findMany({
      filters: { status: 'active' },
      sortBy: 'rangeLow',
      sortDirection: 'asc',
      pagination: {
        skip: 0,
        take: 100,
        page: 1,
        pageSize: 100
      }
    });

    const hoursRemaining = minutesRemaining / 60;

    const semaphore = semaphores.data.find(item => {
      return (
        Number(item.rangeLow) <= hoursRemaining &&
        Number(item.rangeHigh) >= hoursRemaining
      );
    });

    return {
      status: 'active',
      semaphore: semaphore || null,
      minutesRemaining,
      hoursRemaining
    };
  }
}

module.exports = { GetClaimSlaStatusUseCase };
