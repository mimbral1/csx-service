function buildHeaders(overrides = {}) {
  return {
    'mimbral-api-key': 'mimbral-csx-api-key',
    'mimbral-api-secret': 'mimbral-csx-api-secret',
    'mimbral-client': 'mimbral',
    'x-user-id': 'test-user',
    'x-user-role': 'CSX_ADMIN',
    ...overrides
  };
}

module.exports = { buildHeaders };
