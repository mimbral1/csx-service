class IntegrationError extends Error {
  constructor(message, details = null) {
    super(message);

    this.name = 'IntegrationError';
    this.details = details;
    this.isIntegrationError = true;
  }
}

module.exports = { IntegrationError };
