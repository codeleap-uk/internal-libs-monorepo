export { default as figlet } from 'figlet'
export { default as chalk } from 'chalk'
export { default as inquirer } from 'inquirer'

import { Octokit } from 'octokit'
import simpleGit from 'simple-git'
import { cwd, USER_CONFIG } from '../constants'
console.log(cwd)
export const git = simpleGit({
  baseDir: cwd,
})

export const octokit = new Octokit({
  auth: USER_CONFIG.GITHUB_TOKEN,
})

export * from './utils'
export * from './walk'
export * from './android'
export * from './ios'

export { createMobileApp } from './createApp/mobile'

