const { getPagination } = require('../../../shared/pagination/pagination');

class ClaimStatusTransitionController {
  constructor({
    createUseCase,
    updateUseCase,
    getUseCase,
    listUseCase,
    listPossibleTransitionsUseCase
  }) {
    this.createUseCase = createUseCase;
    this.updateUseCase = updateUseCase;
    this.getUseCase = getUseCase;
    this.listUseCase = listUseCase;
    this.listPossibleTransitionsUseCase = listPossibleTransitionsUseCase;
  }

  create = async (req, res, next) => {
    try {
      const entity = await this.createUseCase.execute({
        data: req.validated.body,
        userId: req.headers['x-user-id'] || null
      });

      res.status(200).json({ id: entity.id });
    } catch (error) {
      next(error);
    }
  };

  update = async (req, res, next) => {
    try {
      const entity = await this.updateUseCase.execute({
        id: req.validated.params.id,
        data: req.validated.body,
        userId: req.headers['x-user-id'] || null
      });

      res.status(200).json({ id: entity.id });
    } catch (error) {
      next(error);
    }
  };

  get = async (req, res, next) => {
    try {
      const entity = await this.getUseCase.execute({
        id: req.validated.params.id
      });

      res.status(200).json(entity);
    } catch (error) {
      next(error);
    }
  };

  list = async (req, res, next) => {
    try {
      const pagination = getPagination(req.headers);

      const result = await this.listUseCase.execute({
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

  listPossible = async (req, res, next) => {
    try {
      const actions = await this.listPossibleTransitionsUseCase.execute({
        claimId: req.validated.params.id
      });

      res.status(200).json(actions);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = { ClaimStatusTransitionController };
