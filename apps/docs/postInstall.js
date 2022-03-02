'use strict'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs')
const file = './src/app/timestamp.json'
const data = new Date()

fs.writeFileSync(file, JSON.stringify(data))

console.log('Updated timestamp.json')
