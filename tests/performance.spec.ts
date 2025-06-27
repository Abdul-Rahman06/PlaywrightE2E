import { test, expect } from '@playwright/test';
import { PerformanceUtils } from '../src/utils/performance-utils';
import { ApiUtils } from '../src/utils/api-utils';
import { Logger } from '../src/utils/logger';

const logger = new Logger('PerformanceTests');

test.describe('Performance Testing Suite', () => {
  let performanceUtils: PerformanceUtils;
  let apiUtils: ApiUtils;

  test.beforeEach(async () => {
    apiUtils = new ApiUtils('https://www.saucedemo.com');
    performanceUtils = new PerformanceUtils(apiUtils);
    logger.info('Performance Utils initialized with SauceDemo');
  });

  test.describe('Load Testing', () => {
    test('should perform basic load test with API calls', async () => {
      const testFunction = async () => {
        await apiUtils.get('/');
      };

      const result = await performanceUtils.loadTest(testFunction, {
        duration: 30, // 30 seconds
        users: 5,
        rampUpTime: 10, // 10 seconds ramp up
        thinkTime: 1000, // 1 second between requests
      });

      // Validate load test results
      expect(result.testType).toBe('Load Test');
      expect(result.totalRequests).toBeGreaterThan(0);
      expect(result.successfulRequests).toBeGreaterThan(0);
      expect(result.errorRate).toBeLessThan(5); // Less than 5% error rate
      expect(result.avgResponseTime).toBeLessThan(5000); // Less than 5 seconds
      expect(result.throughput).toBeGreaterThan(0);
      expect(result.duration).toBeGreaterThanOrEqual(30);

      logger.info('Load test completed:', {
        totalRequests: result.totalRequests,
        avgResponseTime: `${result.avgResponseTime.toFixed(2)}ms`,
        errorRate: `${result.errorRate.toFixed(2)}%`,
        throughput: `${result.throughput.toFixed(2)} req/s`,
      });
    });

    test('should perform load test with UI interactions', async ({ page }) => {
      const testFunction = async () => {
        await page.goto('https://www.saucedemo.com/');
        await page.fill('[data-test="username"]', 'standard_user');
        await page.fill('[data-test="password"]', 'secret_sauce');
        await page.click('[data-test="login-button"]');
        await page.waitForSelector('.inventory_list');
      };

      const result = await performanceUtils.loadTest(testFunction, {
        duration: 20, // 20 seconds
        users: 3,
        rampUpTime: 5, // 5 seconds ramp up
        thinkTime: 2000, // 2 seconds between requests
      });

      expect(result.testType).toBe('Load Test');
      expect(result.totalRequests).toBeGreaterThan(0);
      expect(result.errorRate).toBeLessThan(10); // Less than 10% error rate for UI tests

      logger.info('UI Load test completed:', {
        totalRequests: result.totalRequests,
        avgResponseTime: `${result.avgResponseTime.toFixed(2)}ms`,
        errorRate: `${result.errorRate.toFixed(2)}%`,
      });
    });
  });

  test.describe('Stress Testing', () => {
    test('should perform stress test to find breaking point', async () => {
      const testFunction = async () => {
        await apiUtils.get('/');
      };

      const result = await performanceUtils.stressTest(testFunction, {
        maxUsers: 20,
        stepSize: 2,
        stepDuration: 10, // 10 seconds per step
        maxDuration: 120, // 2 minutes max
        errorThreshold: 5, // 5% error threshold
      });

      // Validate stress test results
      expect(result.testType).toBe('Stress Test');
      expect(result.breakingPoint).toBeGreaterThan(0);
      expect(result.results.length).toBeGreaterThan(0);

      // Log breaking point analysis
      const breakingPointResult = result.results.find(r => r.users === result.breakingPoint);
      if (breakingPointResult) {
        logger.info('Breaking point analysis:', {
          users: result.breakingPoint,
          avgResponseTime: `${breakingPointResult.avgResponseTime.toFixed(2)}ms`,
          errorRate: `${breakingPointResult.errorRate.toFixed(2)}%`,
        });
      }

      // Log all results
      result.results.forEach((step, index) => {
        logger.info(`Step ${index + 1}:`, {
          users: step.users,
          avgResponseTime: `${step.avgResponseTime.toFixed(2)}ms`,
          errorRate: `${step.errorRate.toFixed(2)}%`,
        });
      });
    });

    test('should perform stress test with mixed operations', async ({ page }) => {
      const testFunction = async () => {
        // Mix of API and UI operations
        await apiUtils.get('/');
        await page.goto('https://www.saucedemo.com/');
        await page.fill('[data-test="username"]', 'standard_user');
        await page.fill('[data-test="password"]', 'secret_sauce');
        await page.click('[data-test="login-button"]');
      };

      const result = await performanceUtils.stressTest(testFunction, {
        maxUsers: 10,
        stepSize: 1,
        stepDuration: 15, // 15 seconds per step
        maxDuration: 90, // 1.5 minutes max
        errorThreshold: 10, // 10% error threshold for mixed operations
      });

      expect(result.testType).toBe('Stress Test');
      expect(result.breakingPoint).toBeGreaterThan(0);

      logger.info('Mixed operations stress test completed:', {
        breakingPoint: result.breakingPoint,
        totalSteps: result.results.length,
      });
    });
  });

  test.describe('Spike Testing', () => {
    test('should perform spike test with sudden load increase', async () => {
      const testFunction = async () => {
        await apiUtils.get('/');
      };

      const result = await performanceUtils.spikeTest(testFunction, {
        baseUsers: 5,
        spikeUsers: 15,
        baseDuration: 20, // 20 seconds base load
        spikeDuration: 10, // 10 seconds spike
        recoveryDuration: 20, // 20 seconds recovery
      });

      // Validate spike test results
      expect(result.testType).toBe('Spike Test');
      expect(result.results.length).toBe(3); // Base, Spike, Recovery phases

      // Analyze each phase
      result.results.forEach((phase, index) => {
        logger.info(`Phase ${index + 1} - ${phase.phase}:`, {
          users: phase.users,
          avgResponseTime: `${phase.avgResponseTime.toFixed(2)}ms`,
          errorRate: `${phase.errorRate.toFixed(2)}%`,
        });
      });

      // Validate recovery
      const basePhase = result.results[0];
      const recoveryPhase = result.results[2];
      
      // Recovery should be similar to base load
      const responseTimeDiff = Math.abs(recoveryPhase.avgResponseTime - basePhase.avgResponseTime);
      expect(responseTimeDiff).toBeLessThan(basePhase.avgResponseTime * 0.5); // Within 50% of base

      logger.info('Spike test recovery analysis:', {
        baseResponseTime: `${basePhase.avgResponseTime.toFixed(2)}ms`,
        recoveryResponseTime: `${recoveryPhase.avgResponseTime.toFixed(2)}ms`,
        difference: `${responseTimeDiff.toFixed(2)}ms`,
      });
    });
  });

  test.describe('Endurance Testing', () => {
    test('should perform endurance test for long duration', async () => {
      const testFunction = async () => {
        await apiUtils.get('/');
        await new Promise(resolve => setTimeout(resolve, 100)); // Small delay
      };

      const result = await performanceUtils.enduranceTest(testFunction, {
        users: 3,
        duration: 0.1, // 6 minutes (0.1 hours)
        monitoringInterval: 1, // 1 minute intervals
      });

      // Validate endurance test results
      expect(result.testType).toBe('Endurance Test');
      expect(result.monitoringData.length).toBeGreaterThan(0);
      expect(result.duration).toBeGreaterThan(0);
      expect(result.avgErrorRate).toBeLessThan(5); // Less than 5% average error rate

      // Analyze monitoring data
      logger.info('Endurance test summary:', {
        duration: `${result.duration.toFixed(2)} hours`,
        avgResponseTime: `${result.avgResponseTime.toFixed(2)}ms`,
        maxResponseTime: `${result.maxResponseTime.toFixed(2)}ms`,
        avgErrorRate: `${result.avgErrorRate.toFixed(2)}%`,
        monitoringPoints: result.monitoringData.length,
      });

      // Check for performance degradation
      const firstHalf = result.monitoringData.slice(0, Math.floor(result.monitoringData.length / 2));
      const secondHalf = result.monitoringData.slice(Math.floor(result.monitoringData.length / 2));

      const firstHalfAvg = firstHalf.reduce((sum, data) => sum + data.avgResponseTime, 0) / firstHalf.length;
      const secondHalfAvg = secondHalf.reduce((sum, data) => sum + data.avgResponseTime, 0) / secondHalf.length;

      const degradation = ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100;
      
      logger.info('Performance degradation analysis:', {
        firstHalfAvg: `${firstHalfAvg.toFixed(2)}ms`,
        secondHalfAvg: `${secondHalfAvg.toFixed(2)}ms`,
        degradation: `${degradation.toFixed(2)}%`,
      });

      // Performance should not degrade more than 20%
      expect(degradation).toBeLessThan(20);
    });
  });

  test.describe('Performance Monitoring', () => {
    test('should track performance metrics during test execution', async () => {
      const testFunction = async () => {
        await apiUtils.get('/');
      };

      // Start monitoring
      const startMetrics = performanceUtils.getCurrentMetrics();
      expect(startMetrics.responseTimes.length).toBe(0);

      // Run some operations
      await testFunction();
      await testFunction();
      await testFunction();

      // Check metrics after operations
      const endMetrics = performanceUtils.getCurrentMetrics();
      expect(endMetrics.responseTimes.length).toBeGreaterThan(0);
      expect(endMetrics.errors).toBeGreaterThanOrEqual(0);

      logger.info('Performance metrics tracked:', {
        responseTimes: endMetrics.responseTimes.length,
        errors: endMetrics.errors,
        avgResponseTime: endMetrics.responseTimes.length > 0 
          ? `${(endMetrics.responseTimes.reduce((sum, time) => sum + time, 0) / endMetrics.responseTimes.length).toFixed(2)}ms`
          : 'N/A',
      });
    });

    test('should clear metrics between tests', async () => {
      const testFunction = async () => {
        await apiUtils.get('/');
      };

      // Run some operations
      await testFunction();
      await testFunction();

      // Verify metrics exist
      const metricsBefore = performanceUtils.getCurrentMetrics();
      expect(metricsBefore.responseTimes.length).toBeGreaterThan(0);

      // Clear metrics
      performanceUtils.clearMetrics();

      // Verify metrics cleared
      const metricsAfter = performanceUtils.getCurrentMetrics();
      expect(metricsAfter.responseTimes.length).toBe(0);
      expect(metricsAfter.errors).toBe(0);

      logger.info('Metrics cleared successfully');
    });
  });

  test.describe('Real-world Scenarios', () => {
    test('should simulate e-commerce user journey', async ({ page }) => {
      const testFunction = async () => {
        // Simulate e-commerce user journey
        await page.goto('https://www.saucedemo.com/');
        await page.fill('[data-test="username"]', 'standard_user');
        await page.fill('[data-test="password"]', 'secret_sauce');
        await page.click('[data-test="login-button"]');
        await page.waitForSelector('.inventory_list');
        
        // Browse products
        await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
        await page.click('[data-test="add-to-cart-sauce-labs-bike-light"]');
        
        // Go to cart
        await page.click('.shopping_cart_link');
        await page.waitForSelector('.cart_list');
        
        // Checkout
        await page.click('[data-test="checkout"]');
        await page.fill('[data-test="firstName"]', 'John');
        await page.fill('[data-test="lastName"]', 'Doe');
        await page.fill('[data-test="postalCode"]', '12345');
        await page.click('[data-test="continue"]');
        
        // Complete order
        await page.waitForSelector('.summary_info');
        await page.click('[data-test="finish"]');
      };

      const result = await performanceUtils.loadTest(testFunction, {
        duration: 60, // 1 minute
        users: 2,
        rampUpTime: 10,
        thinkTime: 3000, // 3 seconds between journeys
      });

      expect(result.testType).toBe('Load Test');
      expect(result.totalRequests).toBeGreaterThan(0);
      expect(result.errorRate).toBeLessThan(15); // Allow higher error rate for complex UI flows

      logger.info('E-commerce user journey test completed:', {
        totalRequests: result.totalRequests,
        avgResponseTime: `${result.avgResponseTime.toFixed(2)}ms`,
        errorRate: `${result.errorRate.toFixed(2)}%`,
      });
    });

    test('should test API endpoint with authentication', async () => {
      // Set up authentication
      apiUtils.setAuthToken('test-token-12345');
      apiUtils.setHeaders({
        'X-API-Version': 'v1',
        'X-Client-ID': 'test-client',
      });

      const testFunction = async () => {
        // Simulate authenticated API calls to SauceDemo
        await apiUtils.get('/');
        await apiUtils.get('/');
        await apiUtils.get('/');
      };

      const result = await performanceUtils.loadTest(testFunction, {
        duration: 30,
        users: 3,
        rampUpTime: 5,
        thinkTime: 1000,
      });

      expect(result.testType).toBe('Load Test');
      expect(result.totalRequests).toBeGreaterThan(0);
      expect(result.errorRate).toBeLessThan(5);

      logger.info('Authenticated API test completed:', {
        totalRequests: result.totalRequests,
        avgResponseTime: `${result.avgResponseTime.toFixed(2)}ms`,
        errorRate: `${result.errorRate.toFixed(2)}%`,
      });
    });
  });

  test.afterEach(async () => {
    // Clear performance metrics after each test
    performanceUtils.clearMetrics();
    logger.info('Performance metrics cleared');
  });

  test.afterAll(async () => {
    // Get final performance statistics
    const finalMetrics = performanceUtils.getCurrentMetrics();
    logger.info('Final performance test metrics:', finalMetrics);
  });
}); 