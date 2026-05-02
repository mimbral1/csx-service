const { NotFoundError } = require('../../../shared/errors/NotFoundError');
const { ValidationError } = require('../../../shared/errors/ValidationError');
const { prisma } = require('../../../shared/prisma/prisma-client');

class CreateClaimManagementInstanceUseCase {
  constructor({
    claimRepository,
    claimManagementInstanceRepository,
    claimHistoryRepository,
    outboxService
  }) {
    this.claimRepository = claimRepository;
    this.claimManagementInstanceRepository = claimManagementInstanceRepository;
    this.claimHistoryRepository = claimHistoryRepository;
    this.outboxService = outboxService;
  }

  async execute({ claimId, data, userId }) {
    const claim = await this.claimRepository.findById(claimId);

    if (!claim) {
      throw new NotFoundError('Claim not found');
    }

    if (!data.claimManagementId) {
      throw new ValidationError('claimManagementId is required');
    }

    if (!data.claimManagementStatusId) {
      throw new ValidationError('claimManagementStatusId is required');
    }

    const management = await prisma.claimManagement.findUnique({
      where: { id: data.claimManagementId }
    });

    if (!management) {
      throw new NotFoundError('Claim management not found');
    }

    if (management.status !== 'active') {
      throw new ValidationError('Claim management is inactive');
    }

    const managementStatus = await prisma.claimManagementStatus.findUnique({
      where: { id: data.claimManagementStatusId }
    });

    if (!managementStatus) {
      throw new NotFoundError('Claim management status not found');
    }

    if (managementStatus.status !== 'active') {
      throw new ValidationError('Claim management status is inactive');
    }

    const instance = await this.claimManagementInstanceRepository.create({
      claimId,
      claimManagementId: data.claimManagementId,
      claimManagementStatusId: data.claimManagementStatusId,
      comment: data.comment || null,
      assignedAreaId: data.assignedAreaId || null,
      assignedUserId: data.assignedUserId || null,
      userCreated: userId || null,
      userModified: userId || null
    });

    await this.claimHistoryRepository.create({
      claimId,
      changeType: 'management.created',
      oldValue: null,
      newValue: instance.id,
      metadataJson: JSON.stringify({
        source: 'claim-management-instance.create',
        claimManagementId: data.claimManagementId,
        claimManagementStatusId: data.claimManagementStatusId,
        assignedAreaId: data.assignedAreaId || null,
        assignedUserId: data.assignedUserId || null
      }),
      userCreated: userId || null
    });

    await this.outboxService.publish({
      topic: 'csx.claim.management.created',
      eventName: 'claim.management.created',
      aggregateType: 'claim',
      aggregateId: claimId,
      payload: {
        claimId,
        displayId: claim.displayId,
        managementInstanceId: instance.id,
        claimManagementId: data.claimManagementId,
        claimManagementStatusId: data.claimManagementStatusId,
        assignedAreaId: data.assignedAreaId || null,
        assignedUserId: data.assignedUserId || null,
        userCreated: userId || null
      }
    });

    return instance;
  }
}

module.exports = { CreateClaimManagementInstanceUseCase };
