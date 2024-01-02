
const fs = require('fs')
const path = require('path')

const MODULE_NAME = 'CleanNodeModules'

const log = (msg = '', data = ' ') => console.log(`${MODULE_NAME} -> ${msg} `, data)

log('Running')

const dirs = [
  './packages',
  './apps',
]

function deleteNodeModules(path) {
  if (fs.existsSync(path)) {
    try {
      fs.rmSync(path, { recursive: true, force: true })

      log('deleted')
    } catch (e) {
      log('error on delete')
    }
  } else {
    log('not found', { path })
  }
}

const rootNodeModulesPath = './node_modules'

log('[TASK] root node modules', {path: rootNodeModulesPath })

deleteNodeModules(rootNodeModulesPath)

for (const dir of dirs) {
  const directories = fs.readdirSync(dir).filter(file => fs.statSync(path.join(dir, file)).isDirectory())

  for (const directory of directories) {
    const path = `${dir}/${directory}/node_modules`
    
    log(`[TASK] ${dir?.replace('./', '')}/${directory} node modules`, { path })

    deleteNodeModules(path)
  }
}
