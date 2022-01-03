const fs = require('fs')

const packageDirs = fs.readdirSync('packages')

// const moduleConfigs = packageDirs.map((dir) => require(`./packages/${dir}/package.json`))
const entryPoints = []
packageDirs.forEach((dir) => {
    
    const path = `packages/${dir}/src/index.ts`

    let fileExists = true
    try{
        fs.accessSync(path)
    }catch(e){
        fileExists = false
    }

    if(fileExists){
        entryPoints.push(path)
    }
})

module.exports = {
    entryPoints,
    tsconfig: 'packages/web/tsconfig.json',
    out: `../../apps/codeleap-web-template/static/docs`,
}
