import fs from 'fs';
import path from 'path';
import { Logger } from './logger';

/**
 * Report Manager utility
 * Handles report generation, archiving, and cleanup
 */
export class ReportManager {
  private logger: Logger;
  private reportsDir: string;
  private archiveDir: string;
  private currentReportDir: string;

  constructor() {
    this.logger = new Logger('ReportManager');
    this.reportsDir = path.join(process.cwd(), 'reports');
    this.archiveDir = path.join(this.reportsDir, 'archive');
    this.currentReportDir = path.join(this.reportsDir, 'current');
    this.initializeDirectories();
  }

  /**
   * Initialize necessary directories
   */
  private initializeDirectories(): void {
    const directories = [this.reportsDir, this.archiveDir, this.currentReportDir];
    
    directories.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        this.logger.info(`Created directory: ${dir}`);
      }
    });
  }

  /**
   * Archive current reports and prepare for new test run
   */
  async archiveCurrentReports(): Promise<void> {
    try {
      this.logger.info('Starting report archival process...');
      
      // Check if current report directory has any files
      if (fs.existsSync(this.currentReportDir)) {
        const files = fs.readdirSync(this.currentReportDir);
        
        if (files.length > 0) {
          // Create timestamp for archive folder
          const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
          const archiveFolder = path.join(this.archiveDir, `test-run-${timestamp}`);
          
          // Create archive folder
          fs.mkdirSync(archiveFolder, { recursive: true });
          
          // Move all files from current to archive
          files.forEach(file => {
            const sourcePath = path.join(this.currentReportDir, file);
            const destPath = path.join(archiveFolder, file);
            
            if (fs.statSync(sourcePath).isFile()) {
              fs.copyFileSync(sourcePath, destPath);
              fs.unlinkSync(sourcePath);
            } else if (fs.statSync(sourcePath).isDirectory()) {
              this.copyDirectoryRecursive(sourcePath, destPath);
              fs.rmSync(sourcePath, { recursive: true, force: true });
            }
          });
          
          this.logger.info(`Reports archived to: ${archiveFolder}`);
          
          // Clean up old archives (keep last 10)
          await this.cleanupOldArchives();
        }
      }
      
      // Ensure current directory exists and is empty
      if (!fs.existsSync(this.currentReportDir)) {
        fs.mkdirSync(this.currentReportDir, { recursive: true });
      }
      
      this.logger.info('Report archival completed successfully');
    } catch (error) {
      this.logger.error('Failed to archive reports:', error);
      throw error;
    }
  }

  /**
   * Copy directory recursively
   */
  private copyDirectoryRecursive(source: string, destination: string): void {
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true });
    }
    
    const files = fs.readdirSync(source);
    
    files.forEach(file => {
      const sourcePath = path.join(source, file);
      const destPath = path.join(destination, file);
      
      if (fs.statSync(sourcePath).isDirectory()) {
        this.copyDirectoryRecursive(sourcePath, destPath);
      } else {
        fs.copyFileSync(sourcePath, destPath);
      }
    });
  }

  /**
   * Clean up old archives, keeping only the last 10
   */
  private async cleanupOldArchives(): Promise<void> {
    try {
      if (!fs.existsSync(this.archiveDir)) {
        return;
      }
      
      const archives = fs.readdirSync(this.archiveDir)
        .filter(item => {
          const itemPath = path.join(this.archiveDir, item);
          return fs.statSync(itemPath).isDirectory();
        })
        .sort()
        .reverse(); // Most recent first
      
      // Keep only the last 10 archives
      if (archives.length > 10) {
        const archivesToDelete = archives.slice(10);
        
        archivesToDelete.forEach(archive => {
          const archivePath = path.join(this.archiveDir, archive);
          fs.rmSync(archivePath, { recursive: true, force: true });
          this.logger.info(`Deleted old archive: ${archive}`);
        });
        
        this.logger.info(`Cleaned up ${archivesToDelete.length} old archives`);
      }
    } catch (error) {
      this.logger.error('Failed to cleanup old archives:', error);
    }
  }

  /**
   * Get current report directory path
   */
  getCurrentReportPath(): string {
    return this.currentReportDir;
  }

  /**
   * Get archive directory path
   */
  getArchivePath(): string {
    return this.archiveDir;
  }

  /**
   * Get reports directory path
   */
  getReportsPath(): string {
    return this.reportsDir;
  }

  /**
   * Create a custom report file
   */
  createCustomReport(filename: string, content: string): void {
    try {
      const filePath = path.join(this.currentReportDir, filename);
      fs.writeFileSync(filePath, content);
      this.logger.info(`Created custom report: ${filename}`);
    } catch (error) {
      this.logger.error(`Failed to create custom report ${filename}:`, error);
      throw error;
    }
  }

  /**
   * Get list of archived reports
   */
  getArchivedReports(): string[] {
    try {
      if (!fs.existsSync(this.archiveDir)) {
        return [];
      }
      
      return fs.readdirSync(this.archiveDir)
        .filter(item => {
          const itemPath = path.join(this.archiveDir, item);
          return fs.statSync(itemPath).isDirectory();
        })
        .sort()
        .reverse();
    } catch (error) {
      this.logger.error('Failed to get archived reports:', error);
      return [];
    }
  }

  /**
   * Get report statistics
   */
  getReportStats(): any {
    try {
      const stats = {
        currentReports: 0,
        archivedReports: 0,
        totalArchives: 0,
        lastArchiveDate: null
      };
      
      // Count current reports
      if (fs.existsSync(this.currentReportDir)) {
        const currentFiles = fs.readdirSync(this.currentReportDir);
        stats.currentReports = currentFiles.length;
      }
      
      // Count archived reports
      const archives = this.getArchivedReports();
      stats.totalArchives = archives.length;
      
      if (archives.length > 0) {
        const latestArchive = archives[0];
        stats.lastArchiveDate = latestArchive;
        
        // Count files in latest archive
        const latestArchivePath = path.join(this.archiveDir, latestArchive);
        if (fs.existsSync(latestArchivePath)) {
          const archiveFiles = fs.readdirSync(latestArchivePath);
          stats.archivedReports = archiveFiles.length;
        }
      }
      
      return stats;
    } catch (error) {
      this.logger.error('Failed to get report stats:', error);
      return {};
    }
  }

  /**
   * Generate a summary report
   */
  generateSummaryReport(testResults: any): void {
    try {
      const timestamp = new Date().toISOString();
      const summary = {
        timestamp,
        testRun: {
          total: testResults.total || 0,
          passed: testResults.passed || 0,
          failed: testResults.failed || 0,
          skipped: testResults.skipped || 0,
          duration: testResults.duration || 0
        },
        browser: testResults.browser || 'unknown',
        environment: process.env.NODE_ENV || 'development'
      };
      
      const summaryPath = path.join(this.currentReportDir, 'test-summary.json');
      fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
      
      this.logger.info('Generated test summary report');
    } catch (error) {
      this.logger.error('Failed to generate summary report:', error);
    }
  }
} 