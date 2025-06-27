#!/bin/bash

# CI/CD Setup Script for Playwright Framework
# This script handles common CI/CD operations

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if running in CI
is_ci() {
    [ "$CI" = "true" ] || [ "$TF_BUILD" = "True" ] || [ "$JENKINS_URL" != "" ]
}

# Function to setup environment variables
setup_environment() {
    log_info "Setting up environment variables..."
    
    # Create .env file from example
    if [ ! -f .env ]; then
        cp .env.example .env
        log_success "Created .env file from .env.example"
    fi
    
    # Set CI-specific variables
    echo "HEADLESS=true" >> .env
    echo "NODE_ENV=ci" >> .env
    
    # Override with CI environment variables if they exist
    if [ ! -z "$BASE_URL" ]; then
        sed -i "s|BASE_URL=.*|BASE_URL=$BASE_URL|" .env
    fi
    
    if [ ! -z "$SAUCE_USERNAME" ]; then
        sed -i "s|SAUCE_USERNAME=.*|SAUCE_USERNAME=$SAUCE_USERNAME|" .env
    fi
    
    if [ ! -z "$SAUCE_PASSWORD" ]; then
        sed -i "s|SAUCE_PASSWORD=.*|SAUCE_PASSWORD=$SAUCE_PASSWORD|" .env
    fi
    
    log_success "Environment variables configured"
}

# Function to install dependencies
install_dependencies() {
    log_info "Installing dependencies..."
    
    # Install npm dependencies
    npm ci
    
    # Install Playwright browsers
    npx playwright install --with-deps
    
    log_success "Dependencies installed successfully"
}

# Function to run tests
run_tests() {
    local browser=${1:-chromium}
    local shard_index=${2:-1}
    local shard_total=${3:-1}
    
    log_info "Running tests for $browser (shard $shard_index/$shard_total)..."
    
    if [ "$shard_total" -gt 1 ]; then
        npx playwright test --project=$browser --shard=$shard_index/$shard_total
    else
        npx playwright test --project=$browser
    fi
    
    log_success "Tests completed for $browser"
}

# Function to run all browser tests
run_all_tests() {
    log_info "Running tests for all browsers..."
    
    # Run tests for each browser
    for browser in chromium firefox webkit; do
        run_tests $browser
    done
    
    log_success "All browser tests completed"
}

# Function to generate reports
generate_reports() {
    log_info "Generating test reports..."
    
    # Ensure reports directory exists
    mkdir -p reports/current
    
    # Generate HTML report
    if [ -d "reports/current/html-report" ]; then
        log_info "HTML report available at reports/current/html-report"
    fi
    
    # Check for JUnit results
    if [ -f "reports/current/junit.xml" ]; then
        log_info "JUnit results available at reports/current/junit.xml"
    fi
    
    # Check for JSON results
    if [ -f "reports/current/results.json" ]; then
        log_info "JSON results available at reports/current/results.json"
    fi
    
    log_success "Reports generated successfully"
}

# Function to archive reports
archive_reports() {
    log_info "Archiving test reports..."
    
    # Use the report manager to archive
    node -e "
        const { ReportManager } = require('./src/utils/report-manager');
        new ReportManager().archiveCurrentReports().then(() => {
            console.log('Reports archived successfully');
        }).catch(err => {
            console.error('Failed to archive reports:', err);
            process.exit(1);
        });
    "
    
    log_success "Reports archived successfully"
}

# Function to cleanup
cleanup() {
    log_info "Cleaning up..."
    
    # Remove node_modules if in CI
    if is_ci; then
        rm -rf node_modules
        log_info "Removed node_modules"
    fi
    
    # Clean up any temporary files
    find . -name "*.tmp" -delete 2>/dev/null || true
    
    log_success "Cleanup completed"
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [COMMAND] [OPTIONS]"
    echo ""
    echo "Commands:"
    echo "  setup           Setup environment and install dependencies"
    echo "  test [browser]  Run tests for specific browser (default: chromium)"
    echo "  test-all        Run tests for all browsers"
    echo "  report          Generate test reports"
    echo "  archive         Archive current reports"
    echo "  cleanup         Clean up temporary files"
    echo "  full            Run complete CI pipeline (setup -> test-all -> report -> archive)"
    echo ""
    echo "Options:"
    echo "  --shard-index   Shard index for parallel execution"
    echo "  --shard-total   Total number of shards"
    echo ""
    echo "Examples:"
    echo "  $0 setup"
    echo "  $0 test firefox"
    echo "  $0 test chromium --shard-index 1 --shard-total 4"
    echo "  $0 full"
}

# Main script logic
main() {
    local command=${1:-help}
    local browser=${2:-chromium}
    local shard_index=1
    local shard_total=1
    
    # Parse additional arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --shard-index)
                shard_index="$2"
                shift 2
                ;;
            --shard-total)
                shard_total="$2"
                shift 2
                ;;
            *)
                shift
                ;;
        esac
    done
    
    case $command in
        setup)
            setup_environment
            install_dependencies
            ;;
        test)
            run_tests $browser $shard_index $shard_total
            ;;
        test-all)
            run_all_tests
            ;;
        report)
            generate_reports
            ;;
        archive)
            archive_reports
            ;;
        cleanup)
            cleanup
            ;;
        full)
            setup_environment
            install_dependencies
            run_all_tests
            generate_reports
            archive_reports
            cleanup
            ;;
        help|--help|-h)
            show_usage
            ;;
        *)
            log_error "Unknown command: $command"
            show_usage
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@" 