module.exports = {
  default: {
    paths: ["features/**/*.feature"],
    require: [
      "step-definitions/**/*.ts",
      "support/**/*.ts"
    ],
    requireModule: ["ts-node/register"],
    format: ["progress", "json:reports/cucumber-report.json"],
    publishQuiet: true
  }
};
