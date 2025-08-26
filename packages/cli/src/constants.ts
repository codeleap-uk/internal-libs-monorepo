import path from 'path'
import fs from 'fs'
import os from 'os'
import { CodeleapCLIUserConfig } from './types'

const _cwd = process.cwd()

export const isDev = process.env.CODELEAP_CLI_DEV_MODE == 'true'

export const cwd = path.resolve(isDev ? '../../../cli-test' : path.join(
  _cwd,
  isDev ? 'tests' : '',
))

process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(cwd, 'gcp-automation.json')

const isMonorepo = fs.existsSync(path.resolve(__dirname, '../../../apps'))

const projectRoot = path.resolve(__dirname, '../../../')

export const cliDir = isMonorepo ? path.join(projectRoot, 'apps/mobile/') : projectRoot

export const cliConfigPath = path.resolve(cliDir, 'codeleapcli.config.json')

let userConfig = {} as CodeleapCLIUserConfig

try {
  console.log('Reading config', isMonorepo, userConfig)

  userConfig = JSON.parse(fs.readFileSync(
    cliConfigPath,
  ).toString()) as CodeleapCLIUserConfig
} catch (e) {
  console.error(e)
}

export const orgName = 'codeleap-uk'

export const USER_CONFIG = {
 SHELL: true,
  ...userConfig
}

console.log('Current config ->', USER_CONFIG)

export const MOBILE_TEMPLATE_URL = `git@github.com:${orgName}/mobile-template.git`