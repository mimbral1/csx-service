const { NotFoundError } = require('../../../shared/errors/NotFoundError');

class ListPossibleTransitionsUseCase {
  constructor({
    claimRepository,
    claimStatusTransitionRepository
  }) {
    this.claimRepository = claimRepository;
    this.claimStatusTransitionRepository = claimStatusTransitionRepository;
  }

  async execute({ claimId }) {
    const claim = await this.claimRepository.findById(claimId);

    if (!claim) {
      throw new NotFoundError('Claim not found');
    }

    const transitions =
      await this.claimStatusTransitionRepository.findPossibleTransitions({
        currentStatusId: claim.statusId,
        motiveId: claim.motiveId
      });

    return transitions.map(transition => ({
      kind: 'generic',
      name: transition.name,
      componentAttributes: {
        icon: 'arrow-right',
        endpoint: {
          service: 'csx',
          namespace: 'claim',
          method: 'transition'
        },
        endpointParameters: [
          {
            name: 'id',
            target: 'path',
            value: {
              static: claim.id
            }
          },
          {
            name: 'transitionId',
            target: 'body',
            value: {
              static: transition.id
            }
          }
        ],
        transition: {
          id: transition.id,
          from: {
            id: transition.statusFrom.id,
            name: transition.statusFrom.name
          },
          to: {
            id: transition.statusTo.id,
            name: transition.statusTo.name
          },
          color: transition.color,
          requiresPermissions: transition.requiresPermissions,
          updatesDateSolve: transition.updatesDateSolve
        }
      }
    }));
  }
}

module.exports = { ListPossibleTransitionsUseCase };
