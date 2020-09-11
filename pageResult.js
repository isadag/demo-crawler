const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

const seoSkipAudits = ['structured-data', 'robots-txt'];
const performanceSkipAudits = [
    'first-cpu-idle',
    'screenshot-thumbnails', 
    'final-screenshot',
    'max-potential-fid',
    'first-meaningful-paint',
    'estimated-input-latency',
    'render-blocking-resources',
    'uses-responsive-images',
    'offscreen-images',
    'unminified-css',
    'unminified-javascript',
    'unused-css-rules',
    'unused-javascript',
    'uses-optimized-images',
    'uses-webp-images',
    'uses-text-compression',
    'uses-rel-preconnect',
    'server-response-time',
    'redirects',
    'uses-rel-preload',
    'uses-http2',
    'efficient-animated-content',
    'duplicated-javascript',
    'legacy-javascript',
    'total-byte-weight',
    'uses-long-cache-ttl',
    'dom-size',
    'critical-request-chains',
    'user-timings',
    'bootup-time',
    'mainthread-work-breakdown',
    'font-display',
    'performance-budget',
    'timing-budget',
    'resource-summary',
    'third-party-summary',
    'largest-contentful-paint-element',
    'layout-shift-elements',
    'uses-passive-event-listeners',
    'no-document-write',
    'long-tasks',
    'non-composited-animations',
    'large-javascript-libraries',
    'network-requests',
    'network-rtt',
    'network-server-latency',
    'main-thread-tasks',
    'diagnostics',
    'metrics'
];

/* These are the audits I want performed
but others get included, so that's why 
the skipAudits is used to make sure we
exclude the unwanted audits and results
*/
// const performanceOnlyAudits = [
//     'first-contentful-paint',
//     'speed-index',
//     'largest-contentful-paint',
//     'interactive',
//     'total-blocking-time',
//     'cumulative-layout-shift'
// ];

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
    const options = { logLevel: 'error', output: 'json', port: chrome.port, onlyCategories: ['seo', 'performance'], skipAudits: [...performanceSkipAudits, ...seoSkipAudits] };
    const runnerResult = await lighthouse(url, options);

    const endTime = Date.now();
    console.log(`Request executed in ${endTime - startTime} milliseconds`);
    await chrome.kill();

    return {
        "accessibility": null,
        "best-practices": null,
        "performance": runnerResult.lhr.categories["performance"],
        "seo": runnerResult.lhr.categories["seo"],
    }
};