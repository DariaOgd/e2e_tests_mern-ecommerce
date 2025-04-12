const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8000',
    setupNodeEvents(on, config) {
    },
    specPattern: 'cypress/e2e/**/*.cy.js', 
    supportFile: 'cypress/support/e2e.js',
  },

  viewportWidth: 1280,
  viewportHeight: 720,

  defaultCommandTimeout: 8000,
  requestTimeout: 10000,
  responseTimeout: 10000,

  video: false,
  screenshotOnRunFailure: true,

  retries: {
    runMode: 1,
    openMode: 0,
  },
});
