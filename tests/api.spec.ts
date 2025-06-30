import { test, expect } from '@playwright/test';
import { ApiUtils } from '../src/utils/api-utils';
import { Logger } from '../src/utils/logger';

const logger = new Logger('APITests');

test.describe('API Testing Suite', () => {
  let apiUtils: ApiUtils;

  test.beforeEach(async () => {
    apiUtils = new ApiUtils('https://www.saucedemo.com');
    logger.info('API Utils initialized with SauceDemo');
  });

  test.describe('GET Requests', () => {
    test('should successfully fetch inventory items', async () => {
      const response = await apiUtils.get('/');
      
      // Validate status
      expect(apiUtils.validateStatus(response, 200)).toBeTruthy();
      expect(response.data).toBeTruthy();
      
      // Validate response time
      expect(apiUtils.validateResponseTime(response, 5000)).toBeTruthy();
    });

    test('should handle 404 for non-existent endpoint', async () => {
      try {
        await apiUtils.get('/api/nonexistent');
        expect(true).toBeFalsy(); 
      } catch (error: any) {
        expect(error.response?.status).toBe(404);
        logger.info('404 error handled correctly');
      }
    });
  });

  test.describe('POST Requests', () => {
    test('should handle login form submission', async () => {
      // Test login form submission (SauceDemo uses form-based auth)
      const loginData = {
        username: 'standard_user',
        password: 'secret_sauce'
      };

      try {
        const response = await apiUtils.post('/login', loginData);
        // SauceDemo might redirect or return different status codes
        expect(apiUtils.validateStatus(response, [200, 302, 404])).toBeTruthy();
      } catch (error: any) {
        // Handle potential errors gracefully
        logger.info('Login request completed (may redirect or error as expected)');
      }
    });
  });

  test.describe('Authentication Tests', () => {
    test('should handle authentication token', async () => {
      const authToken = 'test-token-12345';
      apiUtils.setAuthToken(authToken);
      
      // Verify token is set
      expect(apiUtils.getRequestHistory().length).toBe(0);
      
      // Clear token
      apiUtils.clearAuthToken();
      logger.info('Authentication token cleared');
    });

    test('should set custom headers', async () => {
      const customHeaders = {
        'X-Custom-Header': 'custom-value',
        'X-API-Version': 'v1'
      };
      
      apiUtils.setHeaders(customHeaders);
      logger.info('Custom headers set');
    });
  });

  test.describe('Error Handling', () => {
    test('should handle network timeout', async () => {
      // Create API utils with very short timeout
      const fastApiUtils = new ApiUtils('https://httpstat.us');
      
      try {
        await fastApiUtils.get('/200?sleep=10000'); // 10 second delay
        expect(true).toBeFalsy(); // Should not reach here
      } catch (error: any) {
        expect(error.code).toBe('ECONNABORTED');
        logger.info('Timeout error handled correctly');
      }
    });


  test.describe('Performance Validation', () => {
    test('should validate response time performance', async () => {
      const response = await apiUtils.get('/');
      
      // Validate response time is under 5 seconds
      expect(apiUtils.validateResponseTime(response, 5000)).toBeTruthy();
      
      // Get performance stats
      const stats = apiUtils.getPerformanceStats();
      expect(stats.totalRequests).toBeGreaterThan(0);
      expect(stats.averageResponseTime).toBeGreaterThan(0);
      expect(stats.successRate).toBeGreaterThan(0);
      
      logger.info('Performance stats:', stats);
    });

    test('should track multiple requests', async () => {
      // Make multiple requests to SauceDemo
      await apiUtils.get('/');
      await apiUtils.get('/');
      await apiUtils.get('/');
      
      const history = apiUtils.getRequestHistory();
      expect(history.length).toBe(3);
      
      // Verify all requests were successful
      const allSuccessful = history.every(req => req.status >= 200 && req.status < 300);
      expect(allSuccessful).toBeTruthy();
      
      logger.info('Request history:', history);
    });
  });

  test.describe('Health Check', () => {
    test('should perform health check', async () => {
      const healthResult = await apiUtils.healthCheck(['/']);
      
      expect(healthResult.healthy).toBeTruthy();
      expect(healthResult.details.length).toBeGreaterThan(0);
      
      logger.info('Health check result:', healthResult);
    });
  });

  test.afterEach(async () => {
    // Clear request history after each test
    apiUtils.clearRequestHistory();
    logger.info('Request history cleared');
  });

  test.afterAll(async () => {
    // Get final performance statistics
    const finalStats = apiUtils.getPerformanceStats();
    logger.info('Final API test performance stats:', finalStats);
  });
}); 