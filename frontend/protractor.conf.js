// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter } = require('jasmine-spec-reporter');
var jasmineReporters = require('jasmine-reporters');
// var exec = require('child_process').exec;

// function execPromise(command) {
//   return new Promise(function(resolve, reject) {
//       exec(command, (error, stdout, stderr) => {
//           if (error) {
//               reject(error);
//               return;
//           }

//           resolve(stdout.trim());
//       });
//   });
// }

exports.config = {
  allScriptsTimeout: 11000,
  specs: [
    './e2e/**/*.e2e-spec.ts'
  ],
  capabilities: {
    'browserName': 'chrome',
    chromeOptions: {
      args: ['start-maximized']
      // args: ['--window-size=800,600'] // THIS!
      // window_size: 1920 x 1080
    }
  },
  // resultJsonOutputFile:'./e2e/e2eresult.json',
  directConnect: true,
  baseUrl: 'http://localhost:4200/',
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: function() {}
  },
  onPrepare() {

    var width = 1600;
    var height = 1200;
    browser.driver.manage().window().setSize(width, height);
    require('ts-node').register({
      project: 'e2e/tsconfig.e2e.json'
    });

    jasmine.getEnv().addReporter(
 new jasmineReporters.JUnitXmlReporter({
             consolidateAll: true,
             savePath: "e2e/results",
             filePrefix: "e2e-results-junit"
            }))
    jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));
  },
  //HTMLReport called once tests are finished
onComplete: function() {
  var browserName, browserVersion;
  var capsPromise = browser.getCapabilities();

  capsPromise.then(function (caps) {
     browserName = caps.get('browserName');
     browserVersion = caps.get('version');

     var HTMLReport = require('protractor-html-reporter');

     testConfig = {
         reportTitle: 'E2E Report',
         outputPath: './e2e/results/',
         screenshotPath: './screenshots',
         testBrowser: browserName,
         browserVersion: browserVersion,
         modifiedSuiteName: false,
         screenshotsOnlyOnFailure: true
     };
     new HTMLReport().from('./e2e/results/e2e-results-junit.xml', testConfig);
 })
//  .then(async function (){
//    try {
//      // runs node file which sends email via Nodemailer
//     const result = await execPromise('node scripts/e2e-test-script.js');
//   } catch (e) {
//     console.error(e.message);
// }

// })
// .then(function (){
//   // console.log('complete!');
// });
}
}
