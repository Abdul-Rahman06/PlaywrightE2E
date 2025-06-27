export const testUsers = {
  standard: {
    username: process.env.SAUCE_USERNAME || 'standard_user',
    password: process.env.SAUCE_PASSWORD || 'secret_sauce',
  },
  locked: {
    username: process.env.SAUCE_LOCKED_USERNAME || 'locked_out_user',
    password: process.env.SAUCE_PASSWORD || 'secret_sauce',
  },
  problem: {
    username: process.env.SAUCE_PROBLEM_USERNAME || 'problem_user',
    password: process.env.SAUCE_PASSWORD || 'secret_sauce',
  },
  performance: {
    username: process.env.SAUCE_PERFORMANCE_USERNAME || 'performance_glitch_user',
    password: process.env.SAUCE_PASSWORD || 'secret_sauce',
  },
}; 