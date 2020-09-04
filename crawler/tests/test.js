const screenshot = require('../screenshot')
const fs = require('fs')

;(async () => {
  const buffer = await screenshot('https://www.google.com')
  fs.writeFileSync('tests/results/screenshot.png', buffer.toString('binary'), 'binary')
})()