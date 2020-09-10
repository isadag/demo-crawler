const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

module.exports = async function (url) {
    const startTime = Date.now();
    console.log(url);

    const args = [
        '--headless',
        '--disable-canvas-aa', // Disable antialiasing on 2d canvas
        '--disable-2d-canvas-clip-aa', // Disable antialiasing on 2d canvas clips
        '--disable-and-delete-previous-log',
        '--disable-auto-reload',
        '--disable-back-forward-cache',
        '--disable-background-networking',
        '--disable-background-timer-throttling',
        '--disable-composited-antialiasing',
        '--disable-component-update',
        '--disable-gl-extensions',
        '--disable-gpu-driver-bug-workarounds',
        '--disable-gpu-early-init',
        '--disable-gpu-memory-buffer-compositor-resources',
        '--disable-gl-drawing-for-tests',
        '--disable-gpu',        
        '--use-gl=desktop', // better cpu usage with --use-gl=desktop rather than --use-gl=swiftshader, still needs more testing.
        '--enable-webgl',
        '--hide-scrollbars',
        '--mute-audio',
        '--no-first-run',
        '--ignore-gpu-blacklist',
        '--no-sandbox',
    ];
    const chrome = await chromeLauncher.launch({ chromeFlags: args });
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