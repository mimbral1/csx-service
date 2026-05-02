const { NotFoundError } = require('../../../shared/errors/NotFoundError');
const { ValidationError } = require('../../../shared/errors/ValidationError');
const { prisma } = require('../../../shared/prisma/prisma-client');

class AssignCompensationToClaimUseCase {
  constructor({
    claimRepository,
    claimHistoryRepository,
    outboxService
  }) {
    this.claimRepository = claimRepository;
    this.claimHistoryRepository = claimHistoryRepository;
    this.outboxService = outboxService;
  }

  async execute({ claimId, data, userId }) {
    const claim = await this.claimRepository.findById(claimId);

    if (!claim) {
      throw new NotFoundError('Claim not found');
    }

    if (!data.compensationId) {
      throw new ValidationError('compensationId is required');
    }

    const compensation = await prisma.claimCompensation.findUnique({
      where: { id: data.compensationId }
    });

    if (!compensation) {
      throw new NotFoundError('Claim compensation not found');
    }

    if (compensation.status !== 'active') {
      throw new ValidationError('Claim compensation is inactive');
    }

    const assignment = await prisma.claimCompensationAssignment.create({
      data: {
        claimId,
        compensationId: data.compensationId,
        comment: data.comment || null,
        amount: data.amount || null,
        currency: data.currency || 'CLP',
        userCreated: userId || null
      }
    });

    await this.claimHistoryRepository.create({
      claimId,
      changeType: 'claimCompensation.assigned',
      oldValue: null,
      newValue: assignment.id,
      metadataJson: JSON.stringify({
        source: 'claim-compensation.assign',
        compensationId: compensation.id,
        compensationName: compensation.name,
        amount: data.amount || null,
        currency: data.currency || 'CLP'
      }),
      userCreated: userId || null
    });

    await this.outboxService.publish({
      topic: 'csx.claim.compensation.assigned',
      eventName: 'claim.compensation.assigned',
      aggregateType: 'claim',
      aggregateId: claimId,
      payload: {
        claimId,
        displayId: claim.displayId,
        assignmentId: assignment.id,
        compensationId: compensation.id,
        compensationName: compensation.name,
        amount: data.amount || null,
        currency: data.currency || 'CLP',
        userCreated: userId || null
      }
    });

    return assignment;
  }
}

module.exports = { AssignCompensationToClaimUseCase };
