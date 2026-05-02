const { env } = require('../config/env');
const { IntegrationError } = require('./integration-error');

async function request({ method, url, headers = {}, body }) {
  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, env.INTEGRATION_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method,
      headers: {
        'content-type': 'application/json',
        ...headers
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    if (!response.ok) {
      throw new IntegrationError('Integration request failed', {
        status: response.status,
        url,
        data
      });
    }

    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new IntegrationError('Integration request timeout', { url });
    }

    if (error.isIntegrationError) {
      throw error;
    }

    throw new IntegrationError('Integration request error', {
      url,
      message: error.message
    });
  } finally {
    clearTimeout(timeout);
  }
}

module.exports = { request };
