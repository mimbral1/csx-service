const { getPagination } = require('../../../shared/pagination/pagination');

class ClaimManagementInstanceController {
  constructor({
    createClaimManagementInstanceUseCase,
    updateClaimManagementInstanceUseCase,
    listClaimManagementInstancesUseCase
  }) {
    this.createClaimManagementInstanceUseCase =
      createClaimManagementInstanceUseCase;
    this.updateClaimManagementInstanceUseCase =
      updateClaimManagementInstanceUseCase;
    this.listClaimManagementInstancesUseCase =
      listClaimManagementInstancesUseCase;
  }

  create = async (req, res, next) => {
    try {
      const instance = await this.createClaimManagementInstanceUseCase.execute({
        claimId: req.validated.params.claimId,
        data: req.validated.body,
        userId: req.headers['x-user-id'] || null
      });

      res.status(200).json({
        id: instance.id
      });
    } catch (error) {
      next(error);
    }
  };

  update = async (req, res, next) => {
    try {
      const instance = await this.updateClaimManagementInstanceUseCase.execute({
        claimManagementInstanceId:
          req.validated.params.claimManagementInstanceId,
        data: req.validated.body,
        userId: req.headers['x-user-id'] || null
      });

      res.status(200).json({
        id: instance.id
      });
    } catch (error) {
      next(error);
    }
  };

  listByClaim = async (req, res, next) => {
    try {
      const pagination = getPagination(req.headers);

      const result = await this.listClaimManagementInstancesUseCase.execute({
        claimId: req.validated.params.claimId,
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

module.exports = { ClaimManagementInstanceController };
