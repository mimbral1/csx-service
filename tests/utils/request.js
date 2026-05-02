const request = require('supertest');
const { app } = require('../../src/app');
const { buildHeaders } = require('./headers');

function api() {
  return request(app);
}

function withHeaders(req, overrides = {}) {
  const headers = buildHeaders(overrides);

  Object.entries(headers).forEach(([key, value]) => {
    req.set(key, value);
  });

  return req;
}

module.exports = {
  api,
  withHeaders
};
