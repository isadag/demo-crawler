const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

module.exports = async function (url) {
    const startTime = Date.now();
    console.log(url);

    const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless', '--no-sandbox'] });
    const options = { logLevel: 'error', output: 'json', port: chrome.port };
    const runnerResult = await lighthouse(url, options);

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