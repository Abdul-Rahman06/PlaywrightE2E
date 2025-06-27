import winston from 'winston';
import path from 'path';

/**
 * Custom Logger class using Winston
 * Provides structured logging for test automation framework
 */
export class Logger {
  private logger: winston.Logger;
  private context: string;

  constructor(context: string = 'Default') {
    this.context = context;
    this.logger = this.createLogger();
  }

  private createLogger(): winston.Logger {
    const logFormat = winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.errors({ stack: true }),
      winston.format.json()
    );

    const consoleFormat = winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp({ format: 'HH:mm:ss' }),
      winston.format.printf(({ timestamp, level, message, context, ...meta }) => {
        return `${timestamp} [${level}] [${context || this.context}]: ${message} ${
          Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
        }`;
      })
    );

    // Create logs directory in reports/current
    const logsDir = path.join(process.cwd(), 'reports', 'current', 'logs');
    if (!require('fs').existsSync(logsDir)) {
      require('fs').mkdirSync(logsDir, { recursive: true });
    }

    return winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: logFormat,
      transports: [
        // Console transport
        new winston.transports.Console({
          format: consoleFormat,
        }),
        // File transport for all logs
        new winston.transports.File({
          filename: path.join(logsDir, 'combined.log'),
          format: logFormat,
        }),
        // File transport for error logs
        new winston.transports.File({
          filename: path.join(logsDir, 'error.log'),
          level: 'error',
          format: logFormat,
        }),
        // File transport for test execution logs
        new winston.transports.File({
          filename: path.join(logsDir, 'test-execution.log'),
          format: logFormat,
        }),
      ],
    });
  }

  info(message: string, meta?: any): void {
    this.logger.info(message, { context: this.context, ...meta });
  }

  error(message: string, error?: any): void {
    this.logger.error(message, { 
      context: this.context, 
      error: error?.message || error,
      stack: error?.stack 
    });
  }

  warn(message: string, meta?: any): void {
    this.logger.warn(message, { context: this.context, ...meta });
  }

  debug(message: string, meta?: any): void {
    this.logger.debug(message, { context: this.context, ...meta });
  }

  /**
   * Log test step information
   */
  logStep(step: string, details?: any): void {
    this.info(`STEP: ${step}`, details);
  }

  /**
   * Log test data information
   */
  logTestData(testData: any): void {
    this.debug('Test Data:', testData);
  }

  /**
   * Log element interaction
   */
  logElementInteraction(action: string, selector: string, value?: string): void {
    this.debug(`Element Interaction: ${action}`, { selector, value });
  }

  /**
   * Log assertion result
   */
  logAssertion(assertion: string, expected: any, actual: any, passed: boolean): void {
    const level = passed ? 'info' : 'error';
    this.logger.log(level, `Assertion: ${assertion}`, {
      expected,
      actual,
      passed,
      context: this.context
    });
  }
} 