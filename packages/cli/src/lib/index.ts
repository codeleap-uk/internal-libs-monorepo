export { default as figlet } from 'figlet'
export { default as chalk } from 'chalk'
export { default as inquirer } from 'inquirer'

import path from 'path'

const _cwd = process.cwd()
export const isDev = process.argv[1] == 'src/index.ts'
export const cwd = path.join(
  _cwd,
  isDev ? 'tests' : '',
)

export * from './utils'
export * from './walk'
export * from './android'
