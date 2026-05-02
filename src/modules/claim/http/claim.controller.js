const { getPagination } = require('../../../shared/pagination/pagination');
const { IdempotencyService } = require('../../../shared/idempotency/idempotency.service');

const idempotencyService = new IdempotencyService();

class ClaimController {
  constructor({
    createClaimUseCase,
    updateClaimUseCase,
    getClaimUseCase,
    listClaimsUseCase,
    assignClaimUseCase,
    scaleClaimUseCase,
    repeatClaimUseCase,
    transitionClaimUseCase,
    changeClaimTypeUseCase
  }) {
    this.createClaimUseCase = createClaimUseCase;
    this.updateClaimUseCase = updateClaimUseCase;
    this.getClaimUseCase = getClaimUseCase;
    this.listClaimsUseCase = listClaimsUseCase;
    this.assignClaimUseCase = assignClaimUseCase;
    this.scaleClaimUseCase = scaleClaimUseCase;
    this.repeatClaimUseCase = repeatClaimUseCase;
    this.transitionClaimUseCase = transitionClaimUseCase;
    this.changeClaimTypeUseCase = changeClaimTypeUseCase;
  }

  create = async (req, res, next) => {
    const idempotencyKey = req.headers['idempotency-key'];

    try {
      const idempotency = await idempotencyService.start({
        key: idempotencyKey,
        scope: 'claim.create',
        body: req.validated.body
      });

      if (idempotency.mode === 'replay') {
        return res.status(200).json(idempotency.response);
      }

      const claim = await this.createClaimUseCase.execute({
        data: req.validated.body,
        userId: req.headers['x-user-id'] || null
      });

      const response = {
        id: claim.id
      };

      await idempotencyService.complete({
        key: idempotencyKey,
        response
      });

      res.status(200).json(response);
    } catch (error) {
      await idempotencyService.fail({
        key: idempotencyKey,
        errorMessage: error.message
      });

      next(error);
    }
  };

  update = async (req, res, next) => {
    try {
      const claim = await this.updateClaimUseCase.execute({
        id: req.validated.params.id,
        data: req.validated.body,
        userId: req.headers['x-user-id'] || null
      });

      res.status(200).json({
        id: claim.id
      });
    } catch (error) {
      next(error);
    }
  };

  get = async (req, res, next) => {
    try {
      const claim = await this.getClaimUseCase.execute({
        id: req.validated.params.id
      });

      res.status(200).json(claim);
    } catch (error) {
      next(error);
    }
  };

  list = async (req, res, next) => {
    try {
      const pagination = getPagination(req.headers);

      const result = await this.listClaimsUseCase.execute({
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

  assign = async (req, res, next) => {
    try {
      const claim = await this.assignClaimUseCase.execute({
        id: req.validated.params.id,
        assigneeId: req.validated.body.assigneeId,
        userId: req.headers['x-user-id'] || null
      });

      res.status(200).json({
        id: claim.id
      });
    } catch (error) {
      next(error);
    }
  };

  scale = async (req, res, next) => {
    try {
      const claim = await this.scaleClaimUseCase.execute({
        id: req.validated.params.id,
        userId: req.headers['x-user-id'] || null
      });

      res.status(200).json({
        id: claim.id
      });
    } catch (error) {
      next(error);
    }
  };

  repeat = async (req, res, next) => {
    try {
      const claim = await this.repeatClaimUseCase.execute({
        id: req.validated.params.id,
        userId: req.headers['x-user-id'] || null
      });

      res.status(200).json({
        id: claim.id
      });
    } catch (error) {
      next(error);
    }
  };

  transition = async (req, res, next) => {
    try {
      const claim = await this.transitionClaimUseCase.execute({
        id: req.validated.params.id,
        transitionId: req.validated.body.transitionId,
        userId: req.headers['x-user-id'] || null
      });

      res.status(200).json({
        id: claim.id
      });
    } catch (error) {
      next(error);
    }
  };

  changeType = async (req, res, next) => {
    try {
      const claim = await this.changeClaimTypeUseCase.execute({
        id: req.validated.params.id,
        typeIds: req.validated.body.typeIds,
        userId: req.headers['x-user-id'] || null
      });

      res.status(200).json({
        id: claim.id
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = { ClaimController };
