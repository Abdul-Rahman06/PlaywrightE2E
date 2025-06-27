import { chromium, FullConfig } from '@playwright/test';
import { Logger } from '../src/utils/logger';
import { ReportManager } from '../src/utils/report-manager';

/**
 * Global teardown function that runs after all tests
 * This is equivalent to TestNG's @AfterSuite
 */
async function globalTeardown(config: FullConfig) {
  const logger = new Logger('GlobalTeardown');
  const reportManager = new ReportManager();
  
  try {
    logger.info('Starting global teardown...');
    
    // Initialize browser context for cleanup tasks
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Perform any global cleanup tasks here
    // For example: data cleanup, logout, etc.
    
    // Generate summary report
    const reportStats = reportManager.getReportStats();
    reportManager.generateSummaryReport({
      total: reportStats.currentReports,
      passed: 0, // This would be calculated from actual test results
      failed: 0, // This would be calculated from actual test results
      skipped: 0, // This would be calculated from actual test results
      duration: 0, // This would be calculated from actual test results
      browser: 'chromium' // This would be the actual browser used
    });
    
    logger.info('Report statistics:', reportStats);
    logger.info('Global teardown completed successfully');
    
    await browser.close();
  } catch (error) {
    logger.error('Global teardown failed:', error);
    throw error;
  }
}

export default globalTeardown; 