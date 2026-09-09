import winston from 'winston';
import fs from 'fs';
import path from 'path';

const logDir = process.env.LOG_DIR || 'logs';

let canWriteToFile = true;

try {
  // Create the log directory if it does not exist
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }
} catch (error) {
  // In serverless environments like Vercel/AWS Lambda, the filesystem is read-only
  console.warn(`Skipping file logging, read-only file system detected: ${error.message}`);
  canWriteToFile = false;
}

const transports = [];

if (canWriteToFile) {
  transports.push(
    // Write all logs with importance level of `error` or less to `error.log`
    new winston.transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' }),
    // Write all logs with importance level of `info` or less to `combined.log`
    new winston.transports.File({ filename: path.join(logDir, 'combined.log') })
  );
}

// Fallback to console logging if we can't write to files (e.g. serverless prod environment), 
// or if we're not in production (for local development)
if (!canWriteToFile || process.env.NODE_ENV !== 'production') {
  transports.push(
    new winston.transports.Console({
      format: process.env.NODE_ENV !== 'production'
        ? winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          )
        : winston.format.json(),
    })
  );
}

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'http',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'task-manager-api' },
  transports: transports,
});

export default logger;
