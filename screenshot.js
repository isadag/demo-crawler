const { chromium } = require("playwright-chromium");

module.exports = async function (url) {
    let browser = null;
    const startTime = Date.now();
    console.log(url);
    // url = "https://www.google.com"; // req.query.url

    try {

        //TODO: Add URL validation and construct valid url    
        console.log('Launch browser');
        browser = await chromium.launch( { args: ['--no-sandbox'] } );

        console.log('Create new page in browser');
        const page = await browser.newPage();

        console.log('Navigate to page');
        await page.goto(url);

        console.log('Grab screenshot');
        const screenshotBuffer = await page.screenshot({ fullPage: true });

        return screenshotBuffer;
    }
    catch (error) {
        // TODO: handle failures
        console.log(error);
    }
    finally {
        if (browser != null) {
            console.log('Close browser');
            await browser.close();
            const endTime = Date.now();
            console.log(`Request executed in ${endTime - startTime} milliseconds`);
        }
    }
};