const getLogLevel = () => {
  return process.env.LOG_LEVEL || 'info';
};

const logger = {
  info: (message) => {
    if (['info', 'debug'].includes(getLogLevel())) {
      console.log(`[INFO] ${new Date().toISOString()} -`, message);
    }
  },
  error: (message) => {
    console.error(`[ERROR] ${new Date().toISOString()} -`, message);
  },
  warn: (message) => {
    if (['warn', 'info', 'debug'].includes(getLogLevel())) {
      console.warn(`[WARN] ${new Date().toISOString()} -`, message);
    }
  },
  debug: (message) => {
    if (getLogLevel() === 'debug') {
      console.log(`[DEBUG] ${new Date().toISOString()} -`, message);
    }
  },
};

module.exports = logger;