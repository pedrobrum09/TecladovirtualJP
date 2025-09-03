const axios = require('axios');
const logger = require('./logger');

function createHttp(baseURL, timeout = Number(process.env.TIMEOUT_MS) || 5000) {
  const instance = axios.create({ baseURL, timeout });

  instance.interceptors.request.use((config) => {
    config.metadata = { start: Date.now() };
    return config;
  });

  instance.interceptors.response.use(
    (res) => res,
    async (error) => {
      const cfg = error.config || {};
      cfg.__retryCount = cfg.__retryCount || 0;
      const maxRetries = 1;
      if (cfg.__retryCount < maxRetries) {
        cfg.__retryCount += 1;
        logger.warn({ url: cfg.url, try: cfg.__retryCount }, 'retrying request');
        return instance(cfg);
      }
      return Promise.reject(error);
    }
  );

  return instance;
}

module.exports = { createHttp };