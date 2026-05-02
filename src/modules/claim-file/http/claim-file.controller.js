const { getPagination } = require('../../../shared/pagination/pagination');

class ClaimFileController {
  constructor({
    attachClaimFileUseCase,
    getClaimFileUseCase,
    listClaimFilesUseCase,
    deleteClaimFileUseCase
  }) {
    this.attachClaimFileUseCase = attachClaimFileUseCase;
    this.getClaimFileUseCase = getClaimFileUseCase;
    this.listClaimFilesUseCase = listClaimFilesUseCase;
    this.deleteClaimFileUseCase = deleteClaimFileUseCase;
  }

  attach = async (req, res, next) => {
    try {
      const file = await this.attachClaimFileUseCase.execute({
        claimId: req.validated.params.id,
        data: req.validated.body,
        userId: req.headers['x-user-id'] || null
      });

      res.status(200).json({
        id: file.id
      });
    } catch (error) {
      next(error);
    }
  };

  get = async (req, res, next) => {
    try {
      const file = await this.getClaimFileUseCase.execute({
        claimId: req.validated.params.id,
        fileId: req.validated.params.fileId
      });

      res.status(200).json(file);
    } catch (error) {
      next(error);
    }
  };

  list = async (req, res, next) => {
    try {
      const pagination = getPagination(req.headers);

      const result = await this.listClaimFilesUseCase.execute({
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

  delete = async (req, res, next) => {
    try {
      await this.deleteClaimFileUseCase.execute({
        claimId: req.validated.params.id,
        fileId: req.validated.params.fileId,
        userId: req.headers['x-user-id'] || null
      });

      res.status(200).json({
        id: req.validated.params.fileId
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = { ClaimFileController };
