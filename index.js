const express = require('express');
const app = express();
const port = process.env.PORT || 3200;
const screenshot = require('./screenshot');
const pageResult = require('./pageResult');

app.get('/', (_, res) => res.status(200).json({ status: 'Up and running' }));

app.get('/screenshot', (req, res) => {
    const url = req.query.url;
    const fullPageScreenshot = req.query.fullPageScreenshot == 'true';
    (async () => {
        const buffer = await screenshot(url, fullPageScreenshot);
        res.setHeader('Content-Disposition', 'attachment; filename="screenshot.png"')
        res.setHeader('Content-Type', 'image/png')
        res.send(buffer)
    })();
});

app.get('/pageresult', (req, res) => {
    const url = req.query.url;
    (async () => {
        const response = await pageResult(url);
        res.setHeader('Content-Type', 'application/json')
        res.send(response)
    })();
});

app.listen(port, () => console.log(`app listening on port ${port}!`))