const { NotFoundError } = require('../../../shared/errors/NotFoundError');
const { prisma } = require('../../../shared/prisma/prisma-client');

class UpdateClaimManagementInstanceUseCase {
  constructor({
    claimManagementInstanceRepository,
    claimHistoryRepository,
    outboxService
  }) {
    this.claimManagementInstanceRepository = claimManagementInstanceRepository;
    this.claimHistoryRepository = claimHistoryRepository;
    this.outboxService = outboxService;
  }

  async execute({ claimManagementInstanceId, data, userId }) {
    const existing = await this.claimManagementInstanceRepository.findById(
      claimManagementInstanceId
    );

    if (!existing) {
      throw new NotFoundError('Claim management instance not found');
    }

    if (data.claimManagementStatusId) {
      const managementStatus = await prisma.claimManagementStatus.findUnique({
        where: { id: data.claimManagementStatusId }
      });

      if (!managementStatus) {
        throw new NotFoundError('Claim management status not found');
      }
    }

    const updated = await this.claimManagementInstanceRepository.update(
      claimManagementInstanceId,
      {
        ...data,
        userModified: userId || null
      }
    );

    await this.claimHistoryRepository.create({
      claimId: existing.claimId,
      changeType: 'management.updated',
      oldValue: existing.id,
      newValue: updated.id,
      metadataJson: JSON.stringify({
        source: 'claim-management-instance.update',
        claimManagementInstanceId,
        previousStatusId: existing.claimManagementStatusId,
        newStatusId:
          data.claimManagementStatusId || existing.claimManagementStatusId
      }),
      userCreated: userId || null
    });

    await this.outboxService.publish({
      topic: 'csx.claim.management.updated',
      eventName: 'claim.management.updated',
      aggregateType: 'claim-management-instance',
      aggregateId: claimManagementInstanceId,
      payload: {
        claimId: existing.claimId,
        managementInstanceId: claimManagementInstanceId,
        previousStatusId: existing.claimManagementStatusId,
        newStatusId:
          data.claimManagementStatusId || existing.claimManagementStatusId,
        userModified: userId || null
      }
    });

    return updated;
  }
}

module.exports = { UpdateClaimManagementInstanceUseCase };
