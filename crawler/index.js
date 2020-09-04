const express = require('express');
const app = express();
const port = process.env.PORT || 3200;
const screenshot = require('./screenshot');

app.get('/', (_, res) => res.status(200).json({ status: 'Up and running' }));

app.get('/screenshot', (req, res) => {
    const url = req.query.url || "https://www.google.com";
    (async () => {
        const buffer = await screenshot(url);
        res.setHeader('Content-Disposition', 'attachment; filename="screenshot.png"')
        res.setHeader('Content-Type', 'image/png')
        res.send(buffer)
    })();
});

app.listen(port, () => console.log(`app listening on port ${port}!`))