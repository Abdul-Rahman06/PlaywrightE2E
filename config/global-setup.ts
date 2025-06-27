import { chromium, FullConfig } from '@playwright/test';
import { Logger } from '../src/utils/logger';
import { ReportManager } from '../src/utils/report-manager';

/**
 * Global setup function that runs before all tests
 * This is equivalent to TestNG's @BeforeSuite
 */
async function globalSetup(config: FullConfig) {
  const logger = new Logger('GlobalSetup');
  const reportManager = new ReportManager();
  
  try {
    logger.info('Starting global setup...');
    
    // Set up test environment
    process.env.NODE_ENV = 'test';
    
    // Archive previous reports before starting new test run
    await reportManager.archiveCurrentReports();
    
    // Initialize browser context for setup tasks
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Perform any global setup tasks here
    // For example: login, data setup, etc.
    
    logger.info('Global setup completed successfully');
    
    await browser.close();
  } catch (error) {
    logger.error('Global setup failed:', error);
    throw error;
  }
}

export default globalSetup; 