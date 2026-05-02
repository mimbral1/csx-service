const { ValidationError } = require('../errors/ValidationError');

function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
      headers: req.headers
    });

    if (!result.success) {
      return next(
        new ValidationError('Invalid request data', result.error.flatten())
      );
    }

    req.validated = result.data;
    next();
  };
}

module.exports = { validate };
