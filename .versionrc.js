const fs = require('fs')
const path = require('path')

const packages = fs.readdirSync('packages')

const packageJsonFiles = packages.map(p => {
    return path.join(process.cwd(), 'packages', p,'package.json')
})

module.exports = {
    packageFiles: packageJsonFiles,
    bumpFiles: packageJsonFiles
}