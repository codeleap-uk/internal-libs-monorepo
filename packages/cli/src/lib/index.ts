export { default as figlet } from 'figlet'
export { default as chalk } from 'chalk'
export { default as inquirer } from 'inquirer'

import { Octokit } from 'octokit'

import { cwd, USER_CONFIG } from '../constants'

import simpleGit from 'simple-git'

export let git = null

try {
  git = simpleGit({
    baseDir: cwd,
  })
} catch {}

export const octokit = new Octokit({
  auth: USER_CONFIG.GITHUB_TOKEN,
})

export * from './utils'
export * from './walk'
export * from './android'
export * from './ios'

export { createMobileApp } from './createApp/mobile'

