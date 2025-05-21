import winston from 'winston';
// Fix: Import DailyRotateFile explicitly
import DailyRotateFile from 'winston-daily-rotate-file';

// Determine if we're in production
const isProduction = process.env.NODE_ENV === 'production';

// Better object stringification handling
const safeStringify = (value: any): string => {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value, null, 2);
    } catch (err) {
      // Properly handle the error
      console.error('Failed to stringify object:', err);
      return `[Complex Object: ${err instanceof Error ? err.message : 'Stringify failed'}]`;
    }
  }
  return String(value);
};

// Custom format for development - much more readable
const devFormat = winston.format.combine(
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.colorize(),
  winston.format.printf(({ timestamp, level, message, ...data }) => {
    // Show message and timestamp on first line
    let output = `${timestamp} ${level}: ${message}`;
    
    // If we have additional data, show it formatted nicely on subsequent lines
    if (Object.keys(data).length > 0) {
      const formattedData = Object.entries(data)
        .map(([key, value]) => `  ${key}: ${safeStringify(value)}`)
        .join('\n');
      output += '\n' + formattedData;
    }
    
    return output;
  })
);

// Production format (structured JSON for log processing tools)
const prodFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json()
);

// Create the logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL ?? 'info',
  format: isProduction ? prodFormat : devFormat,
  transports: [
    new winston.transports.Console(),
    // Fix: Use the imported DailyRotateFile class directly
    new DailyRotateFile({
      filename: 'logs/app-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    })
  ]
});

export default logger;