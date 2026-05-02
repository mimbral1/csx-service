const { getPagination } = require('../../../shared/pagination/pagination');

class ClaimItemController {
  constructor({
    createManyClaimItemsUseCase,
    updateClaimItemUseCase,
    getClaimItemUseCase,
    listClaimItemsUseCase
  }) {
    this.createManyClaimItemsUseCase = createManyClaimItemsUseCase;
    this.updateClaimItemUseCase = updateClaimItemUseCase;
    this.getClaimItemUseCase = getClaimItemUseCase;
    this.listClaimItemsUseCase = listClaimItemsUseCase;
  }

  createMany = async (req, res, next) => {
    try {
      const items = await this.createManyClaimItemsUseCase.execute({
        claimId: req.validated.params.id,
        data: req.validated.body,
        userId: req.headers['x-user-id'] || null
      });

      res.status(200).json({
        id: items.map(item => item.id)
      });
    } catch (error) {
      next(error);
    }
  };

  update = async (req, res, next) => {
    try {
      const item = await this.updateClaimItemUseCase.execute({
        claimId: req.validated.params.id,
        claimItemId: req.validated.params.claimItemId,
        data: req.validated.body,
        userId: req.headers['x-user-id'] || null
      });

      res.status(200).json({ id: item.id });
    } catch (error) {
      next(error);
    }
  };

  get = async (req, res, next) => {
    try {
      const item = await this.getClaimItemUseCase.execute({
        claimId: req.validated.params.id,
        claimItemId: req.validated.params.claimItemId
      });

      res.status(200).json(item);
    } catch (error) {
      next(error);
    }
  };

  list = async (req, res, next) => {
    try {
      const pagination = getPagination(req.headers);

      const result = await this.listClaimItemsUseCase.execute({
        claimId: req.validated.params.id,
        filters: req.query.filters || {},
        sortBy: req.query.sortBy,
        sortDirection: req.query.sortDirection,
        pagination
      });

      res.status(200).json(result.data);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = { ClaimItemController };
