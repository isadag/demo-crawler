// const fs = require('fs');
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

module.exports = async function (url) {
    const startTime = Date.now();
    console.log(url);

    const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless', '--no-sandbox'] });
    const options = { logLevel: 'error', output: 'json', port: chrome.port };
    const runnerResult = await lighthouse(url, options);

    // `.report` is the HTML report as a string
    // const reportHtml = runnerResult.report;
    // fs.writeFileSync('lhreport.html', reportHtml);

    // `.lhr` is the Lighthouse Result as a JS object
    // console.log('Report is done for', runnerResult.lhr.finalUrl);
    // console.log('Performance score was', runnerResult.lhr.categories.performance.score * 100);

    const endTime = Date.now();
    console.log(`Request executed in ${endTime - startTime} milliseconds`);
    await chrome.kill();

    return {
        "accessibility": runnerResult.lhr.categories["accessibility"],
        "best-practices": runnerResult.lhr.categories["best-practices"],
        "performance": runnerResult.lhr.categories["performance"],
        "seo": runnerResult.lhr.categories["seo"],
    }
};