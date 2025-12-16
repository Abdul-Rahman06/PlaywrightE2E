import winston from 'winston';
import path from 'path';
import fs from 'fs';

/**
 * Custom Logger class using Winston
 * Provides structured logging for test automation framework
 * Now supports per-test log files, only keeping logs for failed tests.
 */
export class Logger {
  private logger: winston.Logger;
  private context: string;
  private logFilePath: string | null = null;
  private testTitle: string | null = null;

  constructor(context: string = 'Default', testTitle?: string) {
    this.context = context;
    if (testTitle) {
      this.testTitle = testTitle;
      this.logFilePath = this.createTestLogFile(testTitle);
    }
    this.logger = this.createLogger();
  }

  private createTestLogFile(testTitle: string): string {
    const logsDir = path.join(process.cwd(), 'reports', 'current', 'logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    // Sanitize test title for filename
    const safeTitle = testTitle.replace(/[^a-zA-Z0-9-_]/g, '_').slice(0, 80);
    return path.join(logsDir, `${safeTitle}_${timestamp}.log`);
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

    const transports: winston.transport[] = [
      new winston.transports.Console({
        format: consoleFormat,
      })
    ];

    if (this.logFilePath) {
      transports.push(
        new winston.transports.File({
          filename: this.logFilePath,
          format: logFormat,
        })
      );
    }

    return winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: logFormat,
      transports,
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

  /**
   * Call this after each test to clean up log if test passed
   */
  cleanupLogIfPassed(passed: boolean): void {
    if (passed && this.logFilePath && fs.existsSync(this.logFilePath)) {
      fs.unlinkSync(this.logFilePath);
    }
  }
} 