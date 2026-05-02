const { env } = require('../../config/env');

function getPagination(headers = {}) {
  const requestedPage = Number(
    headers['x-janis-page'] || headers['x-mimbral-page'] || 1
  );

  const requestedPageSize = Number(
    headers['x-janis-page-size'] ||
    headers['x-mimbral-page-size'] ||
    env.DEFAULT_PAGE_SIZE
  );

  const page = Number.isFinite(requestedPage) && requestedPage > 0
    ? Math.floor(requestedPage)
    : 1;

  const normalizedPageSize =
    Number.isFinite(requestedPageSize) && requestedPageSize > 0
      ? Math.floor(requestedPageSize)
      : env.DEFAULT_PAGE_SIZE;

  const pageSize = Math.min(normalizedPageSize, env.MAX_PAGE_SIZE);
  const skip = (page - 1) * pageSize;

  return {
    page,
    pageSize,
    skip,
    take: pageSize
  };
}

function buildPaginationResponse({ data, total, page, pageSize }) {
  const totalPages = pageSize > 0 ? Math.ceil(total / pageSize) : 0;

  return {
    data,
    meta: {
      total,
      page,
      pageSize,
      totalPages
    }
  };
}

module.exports = {
  getPagination,
  buildPaginationResponse
};
