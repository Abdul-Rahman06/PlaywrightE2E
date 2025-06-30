# Playwright TestNG Framework by Abdul Rahman - Senior Test Engineer.

A comprehensive End-to-End test automation framework using Playwright with TestNG framework model and Page Object Model (POM) design pattern.
Test Website used = https://www.saucedemo.com/

## 🚀 Features

- **Page Object Model (POM)**: Maintainable and scalable test structure
- **Dynamic Configuration**: Environment-based configuration management
- **Comprehensive Reporting**: HTML, JSON, JUnit reports with automatic archiving
- **Multi-browser Support**: Chrome, Firefox, Safari, Edge, and mobile browsers
- **API Testing**: Comprehensive HTTP client with authentication, validation, and monitoring
- **Performance Testing**: Load testing, stress testing, spike testing, and endurance testing
- **Test Data Generation**: Dynamic test data using Faker
- **Logging**: Structured logging with Winston
- **Assertion Utilities**: Reusable assertion methods with detailed logging
- **Common Utilities**: Element interactions, waits, and navigation helpers
- **CI/CD Ready**: Pre-configured for GitHub Actions, Jenkins, Azure DevOps

## 📁 Project Structure

```
Playwright-frameworkJS/
├── config/                     # Global setup/teardown
│   ├── global-setup.ts        # Test suite setup
│   └── global-teardown.ts     # Test suite cleanup
├── src/
│   ├── pages/                 # Page Object Models
│   │   ├── login-page.ts      # Login page POM
│   │   └── inventory-page.ts  # Inventory page POM
│   ├── utils/                 # Utility classes
│   │   ├── logger.ts          # Winston-based logging
│   │   ├── common-utils.ts    # Element interactions
│   │   ├── assertion-utils.ts # Assertion helpers
│   │   ├── test-data-generator.ts # Test data generation
│   │   ├── report-manager.ts  # Report management
│   │   ├── api-utils.ts       # API testing utilities
│   │   └── performance-utils.ts # Performance testing utilities
│   └── data/                  # Test data
│       └── test-users.ts      # User credentials
├── tests/                     # Test files
│   ├── login.spec.ts          # Login tests
│   ├── inventory.spec.ts      # Inventory tests
│   ├── logout.spec.ts         # Logout tests
│   ├── problem-user.spec.ts   # Problem user tests
│   ├── locked-user.spec.ts    # Locked user tests
│   ├── performance-user.spec.ts # Performance user tests
│   ├── api.spec.ts            # API tests
│   └── performance.spec.ts    # Performance tests
├── reports/                   # Test reports (auto-generated)
│   ├── current/               # Current test run reports
│   │   ├── html-report/       # HTML reports
│   │   ├── logs/              # Test execution logs
│   │   ├── test-results/      # Screenshots, videos, traces
│   │   ├── results.json       # JSON results
│   │   ├── junit.xml          # JUnit results
│   │   └── test-summary.json  # Test summary
│   └── archive/               # Archived reports (last 10 runs)
├── scripts/                   # CI/CD scripts
│   └── ci-setup.sh           # CI/CD setup script
├── .github/workflows/         # GitHub Actions
│   └── playwright.yml        # GitHub Actions workflow
├── Jenkinsfile               # Jenkins pipeline
├── azure-pipelines.yml       # Azure DevOps pipeline
├── playwright.config.ts       # Playwright configuration
├── tsconfig.json             # TypeScript configuration
├── package.json              # Dependencies and scripts
└── .env.example              # Environment variables template
```

## 🛠️ Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Playwright-frameworkJS
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Playwright browsers**
   ```bash
   npm run install:browsers
   ```

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

## 🧪 Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run tests in headed mode (see browser)
npm run test:headed

# Run tests in debug mode
npm run test:debug

# Run tests with UI mode
npm run test:ui

# Run specific test file
npx playwright test tests/login.spec.ts

# Run tests on specific browser
npx playwright test --project=firefox

# Run all browsers in headed mode
npm run test:headed-all
```

### Browser-Specific Tests

```bash
# Run tests on specific browsers
npm run test:chrome
npm run test:firefox
npm run test:safari
npm run test:mobile

# Run tests in parallel
npm run test:parallel

# Run tests with retry
npm run test:retry
```

### API Testing

```bash
# Run API tests
npm run test:api

# Run API tests in headed mode
npm run test:api:headed

# Run API tests in debug mode
npm run test:api:debug

# Run specific API test
npx playwright test tests/api.spec.ts --grep "should successfully fetch posts"
```

### Performance Testing

```bash
# Run performance tests
npm run test:performance

# Run performance tests in headed mode
npm run test:performance:headed

# Run performance tests in debug mode
npm run test:performance:debug

# Run specific performance test
npx playwright test tests/performance.spec.ts --grep "should perform basic load test"
```

### Report Management

```bash
# View current test reports
npm run test:report:current

# View latest archived reports
npm run test:report:latest

# Clean all reports
npm run clean:reports

# Manually archive current reports
npm run archive:reports
```

## 🔄 CI/CD Integration

The framework is pre-configured for multiple CI/CD platforms:

### GitHub Actions

The framework includes a comprehensive GitHub Actions workflow that:

- ✅ Runs tests on multiple browsers (Chrome, Firefox, Safari)
- ✅ Executes tests in parallel shards for faster execution
- ✅ Publishes test results and artifacts
- ✅ Comments on Pull Requests with test results
- ✅ Supports environment-specific configurations

**Setup:**
1. Add repository secrets in GitHub:
   - `BASE_URL`: Your application URL
   - `SAUCE_USERNAME`: Test username
   - `SAUCE_PASSWORD`: Test password
   - Other SauceDemo credentials

2. The workflow will automatically run on:
   - Push to main/develop branches
   - Pull requests to main/develop
   - Manual triggers

### Jenkins

The framework includes a Jenkins pipeline with:

- ✅ Parameterized builds (browser selection, environment)
- ✅ Parallel test execution
- ✅ HTML and JUnit report publishing
- ✅ Artifact archiving
- ✅ Workspace cleanup

**Setup:**
1. Install required Jenkins plugins:
   - NodeJS Plugin
   - HTML Publisher Plugin
   - JUnit Plugin

2. Configure NodeJS installation in Jenkins

3. Create a new pipeline job using the `Jenkinsfile`

### Azure DevOps

The framework includes an Azure DevOps pipeline with:

- ✅ Multi-stage pipeline (Test + Report)
- ✅ Parallel job execution
- ✅ Test result publishing
- ✅ Artifact management
- ✅ Cross-platform support

**Setup:**
1. Create pipeline variables in Azure DevOps:
   - `BASE_URL`
   - `SAUCE_USERNAME`
   - `SAUCE_PASSWORD`
   - Other credentials

2. Import the `azure-pipelines.yml` file

### CI/CD Scripts

The framework includes a comprehensive CI setup script:

```bash
# Setup environment and install dependencies
npm run ci:setup

# Run tests for specific browser
npm run ci:test firefox

# Run all browser tests
npm run ci:test-all

# Generate reports
npm run ci:report

# Archive reports
npm run ci:archive

# Cleanup
npm run ci:cleanup

# Run complete CI pipeline
npm run ci:full
```

### CI/CD Script Usage

```bash
# Make script executable
chmod +x scripts/ci-setup.sh

# Setup environment
./scripts/ci-setup.sh setup

# Run tests with sharding
./scripts/ci-setup.sh test chromium --shard-index 1 --shard-total 4

# Run complete pipeline
./scripts/ci-setup.sh full
```

## 📊 Reporting System

The framework includes a comprehensive reporting system with automatic archiving:

### Report Structure
- **Current Reports**: `reports/current/` - Latest test run results
- **Archived Reports**: `reports/archive/` - Previous test runs (last 10 kept)
- **Automatic Archiving**: Previous reports are automatically archived before each test run

### Report Types
- **HTML Reports**: Interactive web-based reports
- **JSON Reports**: Machine-readable test results
- **JUnit Reports**: CI/CD integration compatible
- **Test Summary**: Custom summary with statistics
- **Logs**: Detailed execution logs
- **Screenshots/Videos**: Visual evidence for failed tests

### Report Features
- ✅ Automatic archiving of previous reports
- ✅ Cleanup of old archives (keeps last 10)
- ✅ Timestamped archive folders
- ✅ Comprehensive test statistics
- ✅ Multiple report formats

## 🔧 Configuration

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
# SauceDemo Configuration
BASE_URL=https://www.saucedemo.com/
SAUCE_USERNAME=standard_user
SAUCE_PASSWORD=secret_sauce
SAUCE_LOCKED_USERNAME=locked_out_user
SAUCE_PROBLEM_USERNAME=problem_user
SAUCE_PERFORMANCE_USERNAME=performance_glitch_user

# Test Configuration
HEADLESS=true
SLOW_MO=1000
RETRY_COUNT=2
TIMEOUT=30000
```

### CI/CD Environment Variables

For CI/CD platforms, set these environment variables:

```bash
# Required
BASE_URL=https://your-app-url.com
SAUCE_USERNAME=your_test_user
SAUCE_PASSWORD=your_test_password

# Optional
SAUCE_LOCKED_USERNAME=locked_out_user
SAUCE_PROBLEM_USERNAME=problem_user
SAUCE_PERFORMANCE_USERNAME=performance_glitch_user
NODE_ENV=ci
CI=true
```

### Playwright Configuration

The `playwright.config.ts` file includes:
- Multi-browser support
- Parallel test execution
- Retry logic for CI
- Comprehensive reporting
- Global setup/teardown hooks

## 📝 Writing Tests

### Page Object Model Example

```typescript
// src/pages/login-page.ts
export class LoginPage {
  private usernameInput = '#user-name';
  private passwordInput = '#password';
  private loginButton = '#login-button';

  async login(username: string, password: string) {
    await this.utils.fillInput(this.usernameInput, username);
    await this.utils.fillInput(this.passwordInput, password);
    await this.utils.clickElement(this.loginButton);
  }
}
```

### Test Example

```typescript
// tests/login.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/login-page';
import { testUsers } from '../src/data/test-users';

test('should login successfully', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto(BASE_URL);
  await loginPage.login(testUsers.standard.username, testUsers.standard.password);
  // Add assertions
});
```

## 🔌 API Testing

The framework includes comprehensive API testing capabilities using the `ApiUtils` class.

### API Testing Features

- **HTTP Methods**: GET, POST, PUT, PATCH, DELETE
- **Authentication**: Bearer token and custom header support
- **Validation**: Status codes, response schemas, response times
- **File Operations**: Upload and download capabilities
- **Health Checks**: Endpoint availability monitoring
- **Performance Tracking**: Request history and statistics
- **Error Handling**: Comprehensive error management

### API Testing Example

```typescript
// tests/api.spec.ts
import { test, expect } from '@playwright/test';
import { ApiUtils } from '../src/utils/api-utils';

test('should test API endpoints', async () => {
  const apiUtils = new ApiUtils('https://jsonplaceholder.typicode.com');
  
  // GET request with validation
  const response = await apiUtils.get('/posts/1');
  expect(apiUtils.validateStatus(response, 200)).toBeTruthy();
  expect(apiUtils.validateResponseTime(response, 3000)).toBeTruthy();
  
  // POST request with authentication
  apiUtils.setAuthToken('your-token');
  const newPost = await apiUtils.post('/posts', {
    title: 'Test Post',
    body: 'Test Body',
    userId: 1
  });
  expect(newPost.data.title).toBe('Test Post');
});
```

### API Testing Utilities

```typescript
// Initialize API client
const apiUtils = new ApiUtils('https://api.example.com');

// Set authentication
apiUtils.setAuthToken('your-token');
apiUtils.setHeaders({ 'X-Custom-Header': 'value' });

// Make requests
const response = await apiUtils.get('/endpoint');
const postResponse = await apiUtils.post('/endpoint', data);
const putResponse = await apiUtils.put('/endpoint/1', data);
const deleteResponse = await apiUtils.delete('/endpoint/1');

// Validate responses
apiUtils.validateStatus(response, 200);
apiUtils.validateSchema(response, { id: 'required', name: 'required' });
apiUtils.validateResponseTime(response, 5000);

// Health check
const health = await apiUtils.healthCheck(['/health', '/status']);

// Performance statistics
const stats = apiUtils.getPerformanceStats();
```

## ⚡ Performance Testing

The framework includes comprehensive performance testing capabilities using the `PerformanceUtils` class.

### Performance Testing Types

- **Load Testing**: Simulate normal user load
- **Stress Testing**: Find system breaking points
- **Spike Testing**: Test sudden load increases
- **Endurance Testing**: Long-duration stability testing

### Performance Testing Features

- **Concurrent Users**: Simulate multiple users simultaneously
- **Ramp-up Control**: Gradual user increase
- **Think Time**: Realistic delays between actions
- **Metrics Collection**: Response times, throughput, error rates
- **Breaking Point Analysis**: Automatic detection of system limits
- **Performance Degradation**: Monitor long-term performance trends

### Load Testing Example

```typescript
// tests/performance.spec.ts
import { test, expect } from '@playwright/test';
import { PerformanceUtils } from '../src/utils/performance-utils';
import { ApiUtils } from '../src/utils/api-utils';

test('should perform load test', async () => {
  const apiUtils = new ApiUtils('https://jsonplaceholder.typicode.com');
  const performanceUtils = new PerformanceUtils(apiUtils);
  
  const testFunction = async () => {
    await apiUtils.get('/posts/1');
  };
  
  const result = await performanceUtils.loadTest(testFunction, {
    duration: 60, // 60 seconds
    users: 10,    // 10 concurrent users
    rampUpTime: 30, // 30 seconds ramp up
    thinkTime: 1000, // 1 second between requests
  });
  
  expect(result.errorRate).toBeLessThan(5); // Less than 5% errors
  expect(result.avgResponseTime).toBeLessThan(3000); // Less than 3 seconds
});
```

### Stress Testing Example

```typescript
test('should perform stress test', async () => {
  const performanceUtils = new PerformanceUtils();
  
  const testFunction = async () => {
    // Simulate user actions
    await page.goto('https://www.saucedemo.com/');
    await page.fill('[data-test="username"]', 'standard_user');
    await page.fill('[data-test="password"]', 'secret_sauce');
    await page.click('[data-test="login-button"]');
  };
  
  const result = await performanceUtils.stressTest(testFunction, {
    maxUsers: 50,
    stepSize: 5,
    stepDuration: 30, // 30 seconds per step
    maxDuration: 300, // 5 minutes max
    errorThreshold: 10, // 10% error threshold
  });
  
  console.log(`Breaking point: ${result.breakingPoint} users`);
});
```

### Spike Testing Example

```typescript
test('should perform spike test', async () => {
  const performanceUtils = new PerformanceUtils();
  
  const result = await performanceUtils.spikeTest(testFunction, {
    baseUsers: 5,
    spikeUsers: 20,
    baseDuration: 60,   // 1 minute base load
    spikeDuration: 30,  // 30 seconds spike
    recoveryDuration: 60, // 1 minute recovery
  });
  
  // Analyze recovery
  const basePhase = result.results[0];
  const recoveryPhase = result.results[2];
  expect(recoveryPhase.avgResponseTime).toBeCloseTo(basePhase.avgResponseTime, 1);
});
```

### Endurance Testing Example

```typescript
test('should perform endurance test', async () => {
  const performanceUtils = new PerformanceUtils();
  
  const result = await performanceUtils.enduranceTest(testFunction, {
    users: 5,
    duration: 2, // 2 hours
    monitoringInterval: 5, // 5 minutes
  });
  
  // Check for performance degradation
  expect(result.avgErrorRate).toBeLessThan(5);
  
  // Analyze monitoring data
  result.monitoringData.forEach(data => {
    console.log(`Time: ${data.timestamp}, Response: ${data.avgResponseTime}ms, Errors: ${data.errorRate}%`);
  });
});
```

### Performance Testing Utilities

```typescript
// Initialize performance utils
const performanceUtils = new PerformanceUtils(apiUtils);

// Get current metrics
const metrics = performanceUtils.getCurrentMetrics();

// Clear metrics
performanceUtils.clearMetrics();

// Custom test function
const testFunction = async () => {
  // Your test logic here
  await apiUtils.get('/api/endpoint');
  await page.click('#button');
  // etc.
};
```

## 🎯 Best Practices

1. **Use Page Object Model**: Keep page logic separate from test logic
2. **Dynamic Configuration**: Use environment variables for flexibility
3. **Comprehensive Logging**: Log all important actions and assertions
4. **Reusable Utilities**: Use common utilities for repeated operations
5. **Test Data Management**: Generate test data dynamically when possible
6. **Report Analysis**: Regularly review archived reports for trends
7. **CI/CD Integration**: Use the provided CI/CD configurations
8. **Parallel Execution**: Leverage sharding for faster test execution

## 🔍 Debugging

### Debug Mode
```bash
npm run test:debug
```

### UI Mode
```bash
npm run test:ui
```

### Code Generation
```bash
npm run codegen
```

## 📈 CI/CD Best Practices

1. **Environment Management**: Use environment variables for different environments
2. **Parallel Execution**: Use sharding for faster test execution
3. **Artifact Management**: Archive test results and artifacts
4. **Report Publishing**: Publish HTML and JUnit reports
5. **Failure Handling**: Implement proper failure notifications
6. **Security**: Use secrets for sensitive data
7. **Caching**: Cache dependencies for faster builds

## 🤝 Contributing

1. Follow the existing code structure
2. Add comprehensive logging
3. Include proper error handling
4. Update documentation
5. Add tests for new features
6. Ensure CI/CD compatibility

## 📄 License

MIT License - see LICENSE file for details 

## 📞 Contact & Links

**GitHub**: https://github.com/Abdul-Rahman06
**LinkedIn**: https://www.linkedin.com/in/abdul-rehman-b6326a176/
**Email**: Rehmanalee05@gmail.com

---

*This framework demonstrates professional test automation capabilities and modern development practices. Feel free to reach out for collaboration or questions!* 
