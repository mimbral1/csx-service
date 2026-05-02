const { getPagination } = require('../pagination/pagination');

function createCrudController({
  createUseCase,
  updateUseCase,
  getUseCase,
  listUseCase
}) {
  return {
    create: async (req, res, next) => {
      try {
        const entity = await createUseCase.execute({
          data: req.validated.body,
          userId: req.headers['x-user-id'] || null
        });

        res.status(200).json({ id: entity.id });
      } catch (error) {
        next(error);
      }
    },

    update: async (req, res, next) => {
      try {
        const entity = await updateUseCase.execute({
          id: req.validated.params.id,
          data: req.validated.body,
          userId: req.headers['x-user-id'] || null
        });

        res.status(200).json({ id: entity.id });
      } catch (error) {
        next(error);
      }
    },

    get: async (req, res, next) => {
      try {
        const entity = await getUseCase.execute({
          id: req.validated.params.id
        });

        res.status(200).json(entity);
      } catch (error) {
        next(error);
      }
    },

    list: async (req, res, next) => {
      try {
        const pagination = getPagination(req.headers);

        const result = await listUseCase.execute({
          filters: req.query.filters || {},
          sortBy: req.query.sortBy,
          sortDirection: req.query.sortDirection,
          pagination
        });

        res.status(200).json(result.data);
      } catch (error) {
        next(error);
      }
    }
  };
}

module.exports = { createCrudController };
