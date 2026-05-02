const { ForbiddenError } = require('../errors/ForbiddenError');
const { hasPermission } = require('../auth/permissions');

function requirePermission(permission) {
  return (req, res, next) => {
    const role = req.headers['x-user-role'] || 'CSX_READONLY';

    if (!hasPermission(role, permission)) {
      return next(
        new ForbiddenError(`Missing permission: ${permission}`)
      );
    }

    req.auth = {
      ...(req.auth || {}),
      role
    };

    next();
  };
}

module.exports = { requirePermission };
