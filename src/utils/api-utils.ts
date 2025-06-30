import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Logger } from './logger';

/**
 * API Testing Utility
 * Provides comprehensive API testing capabilities with authentication, validation, and reporting
 */
export class ApiUtils {
  private client: AxiosInstance;
  private logger: Logger;
  private baseURL: string;
  private authToken: string | null = null;
  private requestHistory: Array<{
    method: string;
    url: string;
    status: number;
    duration: number;
    timestamp: Date;
  }> = [];

  constructor(baseURL: string = process.env.API_BASE_URL || 'https://api.example.com') {
    this.baseURL = baseURL;
    this.logger = new Logger('ApiUtils');
    
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        (config as any).startTime = Date.now();
        
        this.logger.info(`API Request: ${config.method?.toUpperCase()} ${config.url}`, {
          method: config.method,
          url: config.url,
          headers: config.headers,
          data: config.data,
        });
        return config;
      },
      (error) => {
        this.logger.error('API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for logging
    this.client.interceptors.response.use(
      (response) => {
        const duration = Date.now() - ((response.config as any).startTime || Date.now());
        this.requestHistory.push({
          method: response.config.method || 'GET',
          url: response.config.url || '',
          status: response.status,
          duration,
          timestamp: new Date(),
        });

        this.logger.info(`API Response: ${response.status} ${response.config.url}`, {
          status: response.status,
          statusText: response.statusText,
          duration: `${duration}ms`,
          data: response.data,
        });
        return response;
      },
      (error) => {
        this.logger.error('API Response Error:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          url: error.config?.url,
        });
        return Promise.reject(error);
      }
    );
  }

  /**
   * Set authentication token
   */
  setAuthToken(token: string): void {
    this.authToken = token;
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    this.logger.info('Authentication token set');
  }

  /**
   * Clear authentication token
   */
  clearAuthToken(): void {
    this.authToken = null;
    delete this.client.defaults.headers.common['Authorization'];
    this.logger.info('Authentication token cleared');
  }

  /**
   * Set custom headers
   */
  setHeaders(headers: Record<string, string>): void {
    Object.assign(this.client.defaults.headers.common, headers);
    this.logger.info('Custom headers set', headers);
  }

  /**
   * GET request
   */
  async get(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.client.get(url, config);
  }

  /**
   * POST request
   */
  async post(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.client.post(url, data, config);
  }

  /**
   * PUT request
   */
  async put(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.client.put(url, data, config);
  }

  /**
   * PATCH request
   */
  async patch(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.client.patch(url, data, config);
  }

  /**
   * DELETE request
   */
  async delete(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.client.delete(url, config);
  }

  /**
   * Upload file
   */
  async uploadFile(url: string, file: File, fieldName: string = 'file', config?: AxiosRequestConfig): Promise<AxiosResponse> {
    const formData = new FormData();
    formData.append(fieldName, file);
    
    return this.client.post(url, formData, {
      ...config,
      headers: {
        ...config?.headers,
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  /**
   * Download file
   */
  async downloadFile(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.client.get(url, {
      ...config,
      responseType: 'blob',
    });
  }

  /**
   * Wait for API endpoint to be available
   */
  async waitForEndpoint(url: string, timeout: number = 30000, interval: number = 1000): Promise<boolean> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      try {
        await this.client.get(url, { timeout: 5000 });
        this.logger.info(`Endpoint ${url} is available`);
        return true;
      } catch (error) {
        this.logger.debug(`Endpoint ${url} not available yet, retrying...`);
        await new Promise(resolve => setTimeout(resolve, interval));
      }
    }
    
    this.logger.error(`Endpoint ${url} not available after ${timeout}ms`);
    return false;
  }

  /**
   * Validate response status
   */
  validateStatus(response: AxiosResponse, expectedStatus: number | number[]): boolean {
    const expectedStatuses = Array.isArray(expectedStatus) ? expectedStatus : [expectedStatus];
    const isValid = expectedStatuses.includes(response.status);
    
    this.logger.info(`Status validation: ${response.status} ${isValid ? 'PASSED' : 'FAILED'}`, {
      actual: response.status,
      expected: expectedStatuses,
      isValid,
    });
    
    return isValid;
  }

  /**
   * Validate response schema (basic JSON validation)
   */
  validateSchema(response: AxiosResponse, schema: any): boolean {
    try {
      // Basic schema validation - you can enhance this with JSON Schema libraries
      const data = response.data;
      
      // Check if all required fields exist
      for (const [key, value] of Object.entries(schema)) {
        if (value === 'required' && !(key in data)) {
          this.logger.error(`Schema validation failed: missing required field '${key}'`);
          return false;
        }
      }
      
      this.logger.info('Schema validation PASSED');
      return true;
    } catch (error) {
      this.logger.error('Schema validation failed:', error);
      return false;
    }
  }

  /**
   * Validate response time
   */
  validateResponseTime(response: AxiosResponse, maxTime: number): boolean {
    const duration = this.requestHistory.find(
      req => req.url === response.config.url && req.timestamp.getTime() === Date.now()
    )?.duration || 0;
    
    const isValid = duration <= maxTime;
    
    this.logger.info(`Response time validation: ${duration}ms ${isValid ? 'PASSED' : 'FAILED'}`, {
      actual: duration,
      expected: maxTime,
      isValid,
    });
    
    return isValid;
  }

  /**
   * Get request history
   */
  getRequestHistory(): Array<{
    method: string;
    url: string;
    status: number;
    duration: number;
    timestamp: Date;
  }> {
    return [...this.requestHistory];
  }

  /**
   * Clear request history
   */
  clearRequestHistory(): void {
    this.requestHistory = [];
    this.logger.info('Request history cleared');
  }

  /**
   * Get performance statistics
   */
  getPerformanceStats(): {
    totalRequests: number;
    averageResponseTime: number;
    successRate: number;
    statusCodes: Record<number, number>;
  } {
    const totalRequests = this.requestHistory.length;
    const successfulRequests = this.requestHistory.filter(req => req.status >= 200 && req.status < 300).length;
    const averageResponseTime = totalRequests > 0 
      ? this.requestHistory.reduce((sum, req) => sum + req.duration, 0) / totalRequests 
      : 0;
    
    const statusCodes: Record<number, number> = {};
    this.requestHistory.forEach(req => {
      statusCodes[req.status] = (statusCodes[req.status] || 0) + 1;
    });

    return {
      totalRequests,
      averageResponseTime,
      successRate: totalRequests > 0 ? (successfulRequests / totalRequests) * 100 : 0,
      statusCodes,
    };
  }

  /**
   * Health check
   */
  async healthCheck(endpoints: string[] = ['/health', '/status', '/ping']): Promise<{
    healthy: boolean;
    details: Array<{ endpoint: string; status: number; responseTime: number }>;
  }> {
    const details: Array<{ endpoint: string; status: number; responseTime: number }> = [];
    let healthy = true;

    for (const endpoint of endpoints) {
      try {
        const startTime = Date.now();
        const response = await this.client.get(endpoint, { timeout: 5000 });
        const responseTime = Date.now() - startTime;
        
        details.push({
          endpoint,
          status: response.status,
          responseTime,
        });

        if (response.status >= 400) {
          healthy = false;
        }
      } catch (error) {
        details.push({
          endpoint,
          status: 0,
          responseTime: 0,
        });
        healthy = false;
      }
    }

    this.logger.info(`Health check completed: ${healthy ? 'HEALTHY' : 'UNHEALTHY'}`, { details });
    return { healthy, details };
  }
} 