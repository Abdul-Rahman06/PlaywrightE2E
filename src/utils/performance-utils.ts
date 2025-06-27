import { Logger } from './logger';
import { ApiUtils } from './api-utils';

/**
 * Performance Testing Utility
 * Provides comprehensive performance testing capabilities including load testing, stress testing, and monitoring
 */
export class PerformanceUtils {
  private logger: Logger;
  private apiUtils: ApiUtils;
  private metrics: {
    responseTimes: number[];
    throughput: number[];
    errors: number;
    startTime: number;
    endTime: number;
  };

  constructor(apiUtils?: ApiUtils) {
    this.logger = new Logger('PerformanceUtils');
    this.apiUtils = apiUtils || new ApiUtils();
    this.metrics = {
      responseTimes: [],
      throughput: [],
      errors: 0,
      startTime: 0,
      endTime: 0,
    };
  }

  /**
   * Load Test - Simulate normal load
   */
  async loadTest(
    testFunction: () => Promise<any>,
    options: {
      duration: number; // seconds
      users: number;
      rampUpTime?: number; // seconds
      thinkTime?: number; // milliseconds
    }
  ): Promise<LoadTestResult> {
    this.logger.info('Starting load test', options);
    this.resetMetrics();
    this.metrics.startTime = Date.now();

    const { duration, users, rampUpTime = 0, thinkTime = 0 } = options;
    const endTime = Date.now() + (duration * 1000);
    const rampUpInterval = rampUpTime > 0 ? (rampUpTime * 1000) / users : 0;

    const userPromises: Promise<void>[] = [];
    let activeUsers = 0;

    while (Date.now() < endTime) {
      // Ramp up users gradually
      if (activeUsers < users) {
        const userPromise = this.simulateUser(testFunction, thinkTime, endTime);
        userPromises.push(userPromise);
        activeUsers++;

        if (rampUpInterval > 0) {
          await new Promise(resolve => setTimeout(resolve, rampUpInterval));
        }
      }

      // Clean up completed promises
      const completedPromises = userPromises.filter(p => p.status === 'fulfilled');
      userPromises.splice(0, completedPromises.length);
    }

    // Wait for all remaining users to complete
    await Promise.all(userPromises);
    this.metrics.endTime = Date.now();

    return this.generateLoadTestResult('Load Test');
  }

  /**
   * Stress Test - Find breaking point
   */
  async stressTest(
    testFunction: () => Promise<any>,
    options: {
      maxUsers: number;
      stepSize: number;
      stepDuration: number; // seconds
      maxDuration: number; // seconds
      errorThreshold: number; // percentage
    }
  ): Promise<StressTestResult> {
    this.logger.info('Starting stress test', options);
    this.resetMetrics();
    this.metrics.startTime = Date.now();

    const { maxUsers, stepSize, stepDuration, maxDuration, errorThreshold } = options;
    const endTime = Date.now() + (maxDuration * 1000);
    const results: Array<{ users: number; avgResponseTime: number; errorRate: number }> = [];

    for (let users = stepSize; users <= maxUsers && Date.now() < endTime; users += stepSize) {
      this.logger.info(`Stress test step: ${users} users`);
      
      // Reset metrics for this step
      this.metrics.responseTimes = [];
      this.metrics.errors = 0;
      const stepStartTime = Date.now();
      const stepEndTime = stepStartTime + (stepDuration * 1000);

      // Run concurrent users for this step
      const userPromises: Promise<void>[] = [];
      for (let i = 0; i < users; i++) {
        userPromises.push(this.simulateUser(testFunction, 0, stepEndTime));
      }

      await Promise.all(userPromises);

      // Calculate metrics for this step
      const avgResponseTime = this.metrics.responseTimes.length > 0
        ? this.metrics.responseTimes.reduce((sum, time) => sum + time, 0) / this.metrics.responseTimes.length
        : 0;
      const errorRate = (this.metrics.errors / (this.metrics.responseTimes.length + this.metrics.errors)) * 100;

      results.push({ users, avgResponseTime, errorRate });

      // Check if we've reached the error threshold
      if (errorRate >= errorThreshold) {
        this.logger.info(`Breaking point reached at ${users} users with ${errorRate.toFixed(2)}% error rate`);
        break;
      }
    }

    this.metrics.endTime = Date.now();
    return this.generateStressTestResult(results);
  }

  /**
   * Spike Test - Sudden load increase
   */
  async spikeTest(
    testFunction: () => Promise<any>,
    options: {
      baseUsers: number;
      spikeUsers: number;
      baseDuration: number; // seconds
      spikeDuration: number; // seconds
      recoveryDuration: number; // seconds
    }
  ): Promise<SpikeTestResult> {
    this.logger.info('Starting spike test', options);
    this.resetMetrics();
    this.metrics.startTime = Date.now();

    const { baseUsers, spikeUsers, baseDuration, spikeDuration, recoveryDuration } = options;
    const results: Array<{ phase: string; users: number; avgResponseTime: number; errorRate: number }> = [];

    // Phase 1: Base load
    this.logger.info('Phase 1: Base load');
    const baseResult = await this.runPhase(testFunction, baseUsers, baseDuration);
    results.push({ phase: 'Base Load', ...baseResult });

    // Phase 2: Spike load
    this.logger.info('Phase 2: Spike load');
    const spikeResult = await this.runPhase(testFunction, spikeUsers, spikeDuration);
    results.push({ phase: 'Spike Load', ...spikeResult });

    // Phase 3: Recovery (back to base load)
    this.logger.info('Phase 3: Recovery');
    const recoveryResult = await this.runPhase(testFunction, baseUsers, recoveryDuration);
    results.push({ phase: 'Recovery', ...recoveryResult });

    this.metrics.endTime = Date.now();
    return this.generateSpikeTestResult(results);
  }

  /**
   * Endurance Test - Long duration test
   */
  async enduranceTest(
    testFunction: () => Promise<any>,
    options: {
      users: number;
      duration: number; // hours
      monitoringInterval: number; // minutes
    }
  ): Promise<EnduranceTestResult> {
    this.logger.info('Starting endurance test', options);
    this.resetMetrics();
    this.metrics.startTime = Date.now();

    const { users, duration, monitoringInterval } = options;
    const endTime = Date.now() + (duration * 60 * 60 * 1000); // Convert hours to milliseconds
    const intervalMs = monitoringInterval * 60 * 1000; // Convert minutes to milliseconds

    const monitoringData: Array<{
      timestamp: Date;
      avgResponseTime: number;
      errorRate: number;
      activeUsers: number;
    }> = [];

    // Start continuous load
    const userPromises: Promise<void>[] = [];
    for (let i = 0; i < users; i++) {
      userPromises.push(this.simulateUser(testFunction, 1000, endTime)); // 1 second think time
    }

    // Monitor at intervals
    const monitoringIntervalId = setInterval(() => {
      const avgResponseTime = this.metrics.responseTimes.length > 0
        ? this.metrics.responseTimes.reduce((sum, time) => sum + time, 0) / this.metrics.responseTimes.length
        : 0;
      const errorRate = (this.metrics.errors / (this.metrics.responseTimes.length + this.metrics.errors)) * 100;

      monitoringData.push({
        timestamp: new Date(),
        avgResponseTime,
        errorRate,
        activeUsers: users,
      });

      this.logger.info(`Endurance test monitoring: ${avgResponseTime.toFixed(2)}ms avg, ${errorRate.toFixed(2)}% errors`);
    }, intervalMs);

    // Wait for test completion
    await Promise.all(userPromises);
    clearInterval(monitoringIntervalId);
    this.metrics.endTime = Date.now();

    return this.generateEnduranceTestResult(monitoringData);
  }

  /**
   * Simulate a single user
   */
  private async simulateUser(
    testFunction: () => Promise<any>,
    thinkTime: number,
    endTime: number
  ): Promise<void> {
    while (Date.now() < endTime) {
      const startTime = Date.now();
      
      try {
        await testFunction();
        const responseTime = Date.now() - startTime;
        this.metrics.responseTimes.push(responseTime);
      } catch (error) {
        this.metrics.errors++;
        this.logger.error('User simulation error:', error);
      }

      // Think time between requests
      if (thinkTime > 0) {
        await new Promise(resolve => setTimeout(resolve, thinkTime));
      }
    }
  }

  /**
   * Run a test phase
   */
  private async runPhase(
    testFunction: () => Promise<any>,
    users: number,
    duration: number
  ): Promise<{ users: number; avgResponseTime: number; errorRate: number }> {
    const phaseStartTime = Date.now();
    const phaseEndTime = phaseStartTime + (duration * 1000);
    
    // Reset metrics for this phase
    const phaseResponseTimes: number[] = [];
    let phaseErrors = 0;

    const userPromises: Promise<void>[] = [];
    for (let i = 0; i < users; i++) {
      userPromises.push(this.simulateUserPhase(testFunction, phaseEndTime, phaseResponseTimes, phaseErrors));
    }

    await Promise.all(userPromises);

    const avgResponseTime = phaseResponseTimes.length > 0
      ? phaseResponseTimes.reduce((sum, time) => sum + time, 0) / phaseResponseTimes.length
      : 0;
    const errorRate = (phaseErrors / (phaseResponseTimes.length + phaseErrors)) * 100;

    return { users, avgResponseTime, errorRate };
  }

  /**
   * Simulate user for a specific phase
   */
  private async simulateUserPhase(
    testFunction: () => Promise<any>,
    endTime: number,
    responseTimes: number[],
    errors: number
  ): Promise<void> {
    while (Date.now() < endTime) {
      const startTime = Date.now();
      
      try {
        await testFunction();
        const responseTime = Date.now() - startTime;
        responseTimes.push(responseTime);
      } catch (error) {
        errors++;
        this.logger.error('Phase simulation error:', error);
      }
    }
  }

  /**
   * Reset metrics
   */
  private resetMetrics(): void {
    this.metrics = {
      responseTimes: [],
      throughput: [],
      errors: 0,
      startTime: 0,
      endTime: 0,
    };
  }

  /**
   * Generate load test result
   */
  private generateLoadTestResult(testType: string): LoadTestResult {
    const totalRequests = this.metrics.responseTimes.length + this.metrics.errors;
    const avgResponseTime = this.metrics.responseTimes.length > 0
      ? this.metrics.responseTimes.reduce((sum, time) => sum + time, 0) / this.metrics.responseTimes.length
      : 0;
    const minResponseTime = this.metrics.responseTimes.length > 0 ? Math.min(...this.metrics.responseTimes) : 0;
    const maxResponseTime = this.metrics.responseTimes.length > 0 ? Math.max(...this.metrics.responseTimes) : 0;
    const errorRate = totalRequests > 0 ? (this.metrics.errors / totalRequests) * 100 : 0;
    const throughput = totalRequests / ((this.metrics.endTime - this.metrics.startTime) / 1000);

    return {
      testType,
      totalRequests,
      successfulRequests: this.metrics.responseTimes.length,
      failedRequests: this.metrics.errors,
      avgResponseTime,
      minResponseTime,
      maxResponseTime,
      errorRate,
      throughput,
      duration: (this.metrics.endTime - this.metrics.startTime) / 1000,
      timestamp: new Date(),
    };
  }

  /**
   * Generate stress test result
   */
  private generateStressTestResult(results: Array<{ users: number; avgResponseTime: number; errorRate: number }>): StressTestResult {
    const breakingPoint = results.find(r => r.errorRate >= 5)?.users || results[results.length - 1]?.users || 0;
    
    return {
      testType: 'Stress Test',
      breakingPoint,
      results,
      timestamp: new Date(),
    };
  }

  /**
   * Generate spike test result
   */
  private generateSpikeTestResult(results: Array<{ phase: string; users: number; avgResponseTime: number; errorRate: number }>): SpikeTestResult {
    return {
      testType: 'Spike Test',
      results,
      timestamp: new Date(),
    };
  }

  /**
   * Generate endurance test result
   */
  private generateEnduranceTestResult(monitoringData: Array<{ timestamp: Date; avgResponseTime: number; errorRate: number; activeUsers: number }>): EnduranceTestResult {
    const avgResponseTime = monitoringData.reduce((sum, data) => sum + data.avgResponseTime, 0) / monitoringData.length;
    const maxResponseTime = Math.max(...monitoringData.map(data => data.avgResponseTime));
    const avgErrorRate = monitoringData.reduce((sum, data) => sum + data.errorRate, 0) / monitoringData.length;

    return {
      testType: 'Endurance Test',
      monitoringData,
      avgResponseTime,
      maxResponseTime,
      avgErrorRate,
      duration: (this.metrics.endTime - this.metrics.startTime) / (1000 * 60 * 60), // hours
      timestamp: new Date(),
    };
  }

  /**
   * Get current performance metrics
   */
  getCurrentMetrics(): typeof this.metrics {
    return { ...this.metrics };
  }

  /**
   * Clear performance metrics
   */
  clearMetrics(): void {
    this.resetMetrics();
    this.logger.info('Performance metrics cleared');
  }
}

// Type definitions
export interface LoadTestResult {
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

export interface StressTestResult {
  testType: string;
  breakingPoint: number;
  results: Array<{ users: number; avgResponseTime: number; errorRate: number }>;
  timestamp: Date;
}

export interface SpikeTestResult {
  testType: string;
  results: Array<{ phase: string; users: number; avgResponseTime: number; errorRate: number }>;
  timestamp: Date;
}

export interface EnduranceTestResult {
  testType: string;
  monitoringData: Array<{ timestamp: Date; avgResponseTime: number; errorRate: number; activeUsers: number }>;
  avgResponseTime: number;
  maxResponseTime: number;
  avgErrorRate: number;
  duration: number;
  timestamp: Date;
} 