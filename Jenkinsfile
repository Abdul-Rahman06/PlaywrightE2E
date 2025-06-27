pipeline {
    agent any
    
    environment {
        NODE_VERSION = '18'
        PLAYWRIGHT_BROWSERS_PATH = '0'
        CI = 'true'
    }
    
    parameters {
        choice(
            name: 'BROWSER',
            choices: ['chromium', 'firefox', 'webkit', 'all'],
            description: 'Select browser to run tests on'
        )
        choice(
            name: 'ENVIRONMENT',
            choices: ['staging', 'production', 'development'],
            description: 'Select environment to test against'
        )
        booleanParam(
            name: 'PARALLEL',
            defaultValue: true,
            description: 'Run tests in parallel'
        )
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Setup Environment') {
            steps {
                script {
                    // Create environment file
                    sh '''
                        cp .env.example .env
                        echo "BASE_URL=${BASE_URL}" >> .env
                        echo "SAUCE_USERNAME=${SAUCE_USERNAME}" >> .env
                        echo "SAUCE_PASSWORD=${SAUCE_PASSWORD}" >> .env
                        echo "SAUCE_LOCKED_USERNAME=${SAUCE_LOCKED_USERNAME}" >> .env
                        echo "SAUCE_PROBLEM_USERNAME=${SAUCE_PROBLEM_USERNAME}" >> .env
                        echo "SAUCE_PERFORMANCE_USERNAME=${SAUCE_PERFORMANCE_USERNAME}" >> .env
                        echo "HEADLESS=true" >> .env
                        echo "NODE_ENV=ci" >> .env
                    '''
                }
            }
        }
        
        stage('Install Dependencies') {
            steps {
                script {
                    // Setup Node.js
                    nodejs(nodeJSInstallationName: 'NodeJS-18') {
                        sh 'npm ci'
                        sh 'npx playwright install --with-deps'
                    }
                }
            }
        }
        
        stage('Run Tests') {
            parallel {
                stage('Chrome Tests') {
                    when {
                        anyOf {
                            expression { params.BROWSER == 'chromium' }
                            expression { params.BROWSER == 'all' }
                        }
                    }
                    steps {
                        script {
                            nodejs(nodeJSInstallationName: 'NodeJS-18') {
                                sh 'npx playwright test --project=chromium'
                            }
                        }
                    }
                    post {
                        always {
                            archiveArtifacts artifacts: 'reports/current/**/*', fingerprint: true
                            publishHTML([
                                allowMissing: false,
                                alwaysLinkToLastBuild: true,
                                keepAll: true,
                                reportDir: 'reports/current/html-report',
                                reportFiles: 'index.html',
                                reportName: 'Chrome Test Report'
                            ])
                        }
                    }
                }
                
                stage('Firefox Tests') {
                    when {
                        anyOf {
                            expression { params.BROWSER == 'firefox' }
                            expression { params.BROWSER == 'all' }
                        }
                    }
                    steps {
                        script {
                            nodejs(nodeJSInstallationName: 'NodeJS-18') {
                                sh 'npx playwright test --project=firefox'
                            }
                        }
                    }
                    post {
                        always {
                            archiveArtifacts artifacts: 'reports/current/**/*', fingerprint: true
                            publishHTML([
                                allowMissing: false,
                                alwaysLinkToLastBuild: true,
                                keepAll: true,
                                reportDir: 'reports/current/html-report',
                                reportFiles: 'index.html',
                                reportName: 'Firefox Test Report'
                            ])
                        }
                    }
                }
                
                stage('Safari Tests') {
                    when {
                        anyOf {
                            expression { params.BROWSER == 'webkit' }
                            expression { params.BROWSER == 'all' }
                        }
                    }
                    steps {
                        script {
                            nodejs(nodeJSInstallationName: 'NodeJS-18') {
                                sh 'npx playwright test --project=webkit'
                            }
                        }
                    }
                    post {
                        always {
                            archiveArtifacts artifacts: 'reports/current/**/*', fingerprint: true
                            publishHTML([
                                allowMissing: false,
                                alwaysLinkToLastBuild: true,
                                keepAll: true,
                                reportDir: 'reports/current/html-report',
                                reportFiles: 'index.html',
                                reportName: 'Safari Test Report'
                            ])
                        }
                    }
                }
            }
        }
        
        stage('Generate Reports') {
            steps {
                script {
                    nodejs(nodeJSInstallationName: 'NodeJS-18') {
                        // Publish JUnit results
                        publishTestResults testResultsPattern: 'reports/current/junit.xml'
                        
                        // Publish HTML report
                        publishHTML([
                            allowMissing: false,
                            alwaysLinkToLastBuild: true,
                            keepAll: true,
                            reportDir: 'reports/current/html-report',
                            reportFiles: 'index.html',
                            reportName: 'Playwright Test Report'
                        ])
                        
                        // Archive all reports
                        archiveArtifacts artifacts: 'reports/**/*', fingerprint: true
                    }
                }
            }
        }
    }
    
    post {
        always {
            script {
                // Clean up workspace
                cleanWs()
            }
        }
        success {
            echo 'All tests passed successfully!'
        }
        failure {
            echo 'Some tests failed. Check the reports for details.'
        }
        unstable {
            echo 'Tests are unstable. Review the results.'
        }
    }
} 