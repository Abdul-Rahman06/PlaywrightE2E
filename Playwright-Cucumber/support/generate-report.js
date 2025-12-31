const reporter = require("cucumber-html-reporter");

reporter.generate({
    theme: "bootstrap",
    jsonFile: "reports/cucumber-report.json",
    output: "reports/cucumber-report.html",
    reportSuiteAsScenarios: true,
    scenarioTimestamp: true
});

console.log(" Cucumber HTML report generated");
