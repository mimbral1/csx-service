const { getPagination } = require('../../../shared/pagination/pagination');

class ClaimHistoryController {
  constructor({ listClaimHistoryUseCase }) {
    this.listClaimHistoryUseCase = listClaimHistoryUseCase;
  }

  list = async (req, res, next) => {
    try {
      const pagination = getPagination(req.headers);

      const result = await this.listClaimHistoryUseCase.execute({
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

module.exports = { ClaimHistoryController };
