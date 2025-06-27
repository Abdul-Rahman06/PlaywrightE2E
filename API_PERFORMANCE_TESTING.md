# API & Performance Testing Guide

This document provides comprehensive guidance on using the API and Performance testing capabilities in the Playwright TestNG Framework.

## 🔌 API Testing

### Overview

The framework includes a powerful `ApiUtils` class that provides comprehensive HTTP client capabilities with built-in validation, authentication, and monitoring features.

### Key Features

- **HTTP Methods**: Full support for GET, POST, PUT, PATCH, DELETE
- **Authentication**: Bearer token and custom header management
- **Validation**: Status codes, response schemas, response times
- **File Operations**: Upload and download capabilities
- **Health Checks**: Endpoint availability monitoring
- **Performance Tracking**: Request history and statistics
- **Error Handling**: Comprehensive error management and logging

### Basic Usage

```typescript
import { ApiUtils } from '../src/utils/api-utils';

// Initialize with base URL
const apiUtils = new ApiUtils('https://api.example.com');

// Make requests
const response = await apiUtils.get('/users/1');
const newUser = await apiUtils.post('/users', { name: 'John', email: 'john@example.com' });
```

### Authentication

```typescript
// Set bearer token
apiUtils.setAuthToken('your-jwt-token');

// Set custom headers
apiUtils.setHeaders({
  'X-API-Version': 'v1',
  'X-Client-ID': 'your-client-id'
});

// Clear authentication
apiUtils.clearAuthToken();
```

### Validation

```typescript
// Validate status code
expect(apiUtils.validateStatus(response, 200)).toBeTruthy();
expect(apiUtils.validateStatus(response, [200, 201])).toBeTruthy();

// Validate response schema
const schema = {
  id: 'required',
  name: 'required',
  email: 'required'
};
expect(apiUtils.validateSchema(response, schema)).toBeTruthy();

// Validate response time
expect(apiUtils.validateResponseTime(response, 3000)).toBeTruthy();
```

### Health Checks

```typescript
// Check endpoint health
const health = await apiUtils.healthCheck(['/health', '/status', '/ping']);

if (health.healthy) {
  console.log('All endpoints are healthy');
} else {
  console.log('Some endpoints are unhealthy:', health.details);
}
```

### Performance Statistics

```typescript
// Get performance stats
const stats = apiUtils.getPerformanceStats();
console.log('Total requests:', stats.totalRequests);
console.log('Average response time:', stats.averageResponseTime);
console.log('Success rate:', stats.successRate);
console.log('Status codes:', stats.statusCodes);
```

### File Operations

```typescript
// Upload file
const file = Buffer.from('file content');
const uploadResponse = await apiUtils.uploadFile('/upload', file, 'file');

// Download file
const downloadResponse = await apiUtils.downloadFile('/files/document.pdf');
```

### Error Handling

```typescript
try {
  const response = await apiUtils.get('/nonexistent');
} catch (error) {
  if (error.response?.status === 404) {
    console.log('Resource not found');
  } else if (error.code === 'ECONNABORTED') {
    console.log('Request timeout');
  }
}
```

## ⚡ Performance Testing

### Overview

The framework includes a comprehensive `PerformanceUtils` class that provides various types of performance testing capabilities.

### Testing Types

#### 1. Load Testing
Simulates normal user load to verify system performance under expected conditions.

```typescript
import { PerformanceUtils } from '../src/utils/performance-utils';

const performanceUtils = new PerformanceUtils();

const testFunction = async () => {
  await apiUtils.get('/api/endpoint');
  // Add more test actions
};

const result = await performanceUtils.loadTest(testFunction, {
  duration: 60,      // 60 seconds
  users: 10,         // 10 concurrent users
  rampUpTime: 30,    // 30 seconds ramp up
  thinkTime: 1000,   // 1 second between requests
});

console.log('Error rate:', result.errorRate);
console.log('Average response time:', result.avgResponseTime);
console.log('Throughput:', result.throughput);
```

#### 2. Stress Testing
Finds the breaking point of the system by gradually increasing load.

```typescript
const result = await performanceUtils.stressTest(testFunction, {
  maxUsers: 50,
  stepSize: 5,
  stepDuration: 30,    // 30 seconds per step
  maxDuration: 300,    // 5 minutes max
  errorThreshold: 10,  // 10% error threshold
});

console.log('Breaking point:', result.breakingPoint, 'users');
```

#### 3. Spike Testing
Tests system behavior during sudden load increases.

```typescript
const result = await performanceUtils.spikeTest(testFunction, {
  baseUsers: 5,
  spikeUsers: 20,
  baseDuration: 60,    // 1 minute base load
  spikeDuration: 30,   // 30 seconds spike
  recoveryDuration: 60, // 1 minute recovery
});

// Analyze each phase
result.results.forEach(phase => {
  console.log(`${phase.phase}: ${phase.users} users, ${phase.avgResponseTime}ms avg`);
});
```

#### 4. Endurance Testing
Tests system stability over long periods.

```typescript
const result = await performanceUtils.enduranceTest(testFunction, {
  users: 5,
  duration: 2,         // 2 hours
  monitoringInterval: 5, // 5 minutes
});

console.log('Average error rate:', result.avgErrorRate);
console.log('Max response time:', result.maxResponseTime);
```

### Real-world Examples

#### E-commerce User Journey

```typescript
const testFunction = async () => {
  // Login
  await page.goto('https://www.saucedemo.com/');
  await page.fill('[data-test="username"]', 'standard_user');
  await page.fill('[data-test="password"]', 'secret_sauce');
  await page.click('[data-test="login-button"]');
  
  // Browse products
  await page.waitForSelector('.inventory_list');
  await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
  
  // Checkout
  await page.click('.shopping_cart_link');
  await page.click('[data-test="checkout"]');
  await page.fill('[data-test="firstName"]', 'John');
  await page.fill('[data-test="lastName"]', 'Doe');
  await page.fill('[data-test="postalCode"]', '12345');
  await page.click('[data-test="continue"]');
  await page.click('[data-test="finish"]');
};

const result = await performanceUtils.loadTest(testFunction, {
  duration: 300, // 5 minutes
  users: 5,
  rampUpTime: 60,
  thinkTime: 2000,
});
```

#### API Endpoint Testing

```typescript
const testFunction = async () => {
  // Authenticated API calls
  await apiUtils.get('/users/1');
  await apiUtils.post('/posts', {
    title: 'Test Post',
    body: 'Test Body',
    userId: 1
  });
  await apiUtils.put('/posts/1', {
    id: 1,
    title: 'Updated Post',
    body: 'Updated Body',
    userId: 1
  });
};

const result = await performanceUtils.stressTest(testFunction, {
  maxUsers: 20,
  stepSize: 2,
  stepDuration: 20,
  maxDuration: 200,
  errorThreshold: 5,
});
```

### Performance Metrics

#### Load Test Results

```typescript
interface LoadTestResult {
  testType: string;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  avgResponseTime: number;
  minResponseTime: number;
  maxResponseTime: number;
  errorRate: number;
  throughput: number;
  duration: number;
  timestamp: Date;
}
```

#### Stress Test Results

```typescript
interface StressTestResult {
  testType: string;
  breakingPoint: number;
  results: Array<{
    users: number;
    avgResponseTime: number;
    errorRate: number;
  }>;
  timestamp: Date;
}
```

#### Spike Test Results

```typescript
interface SpikeTestResult {
  testType: string;
  results: Array<{
    phase: string;
    users: number;
    avgResponseTime: number;
    errorRate: number;
  }>;
  timestamp: Date;
}
```

#### Endurance Test Results

```typescript
interface EnduranceTestResult {
  testType: string;
  monitoringData: Array<{
    timestamp: Date;
    avgResponseTime: number;
    errorRate: number;
    activeUsers: number;
  }>;
  avgResponseTime: number;
  maxResponseTime: number;
  avgErrorRate: number;
  duration: number;
  timestamp: Date;
}
```

### Best Practices

#### API Testing

1. **Use Environment Variables**: Configure base URLs and credentials via environment variables
2. **Validate Responses**: Always validate status codes, schemas, and response times
3. **Handle Errors**: Implement proper error handling for network issues
4. **Monitor Performance**: Track request history and performance statistics
5. **Health Checks**: Regularly check endpoint availability

#### Performance Testing

1. **Start Small**: Begin with low user counts and gradually increase
2. **Monitor Resources**: Watch system resources during testing
3. **Set Realistic Goals**: Define acceptable error rates and response times
4. **Test Recovery**: Verify system recovery after load spikes
5. **Document Results**: Keep detailed records of test results and configurations

### Running Tests

```bash
# API Tests
npm run test:api
npm run test:api:headed
npm run test:api:debug

# Performance Tests
npm run test:performance
npm run test:performance:headed
npm run test:performance:debug

# Specific Tests
npx playwright test tests/api.spec.ts --grep "should successfully fetch posts"
npx playwright test tests/performance.spec.ts --grep "should perform basic load test"
```

### Configuration

#### Environment Variables

```env
# API Configuration
API_BASE_URL=https://api.example.com
API_TIMEOUT=30000
API_RETRY_COUNT=3

# Performance Configuration
PERFORMANCE_MAX_USERS=100
PERFORMANCE_DEFAULT_DURATION=300
PERFORMANCE_ERROR_THRESHOLD=5
```

#### Test Configuration

```typescript
// playwright.config.ts
export default defineConfig({
  // ... other config
  projects: [
    {
      name: 'api-tests',
      testMatch: /.*api\.spec\.ts/,
      timeout: 60000,
    },
    {
      name: 'performance-tests',
      testMatch: /.*performance\.spec\.ts/,
      timeout: 300000, // 5 minutes for performance tests
    },
  ],
});
```

### Troubleshooting

#### Common Issues

1. **Timeout Errors**: Increase timeout values for slow endpoints
2. **Memory Issues**: Reduce concurrent users or test duration
3. **Network Errors**: Check network connectivity and endpoint availability
4. **Authentication Errors**: Verify token validity and permissions

#### Debug Tips

1. **Enable Debug Logging**: Use `npm run test:api:debug` or `npm run test:performance:debug`
2. **Monitor Logs**: Check detailed logs in `reports/current/logs/`
3. **Use Headed Mode**: Run tests with `--headed` flag to see browser actions
4. **Check Metrics**: Review performance statistics and request history

### Integration with CI/CD

The API and Performance tests are fully integrated with the CI/CD pipeline:

```yaml
# .github/workflows/playwright.yml
- name: Run API Tests
  run: npm run test:api

- name: Run Performance Tests
  run: npm run test:performance
```

### Reporting

Test results are automatically included in the framework's comprehensive reporting system:

- **HTML Reports**: Interactive web-based reports with API and performance metrics
- **JSON Reports**: Machine-readable test results
- **JUnit Reports**: CI/CD integration compatible
- **Performance Metrics**: Detailed performance statistics and trends

---

For more information, refer to the main README.md file or contact the framework maintainer. 