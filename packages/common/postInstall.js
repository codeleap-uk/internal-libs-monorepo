'use strict'

// NOTE this file should be executed from the child directory

const fse = require('fs-extra')
fse.copySync('./node_modules/codeleap-common/.vscode', './.vscode')
