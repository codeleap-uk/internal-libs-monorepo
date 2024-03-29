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

export const cliConfigPath = path.resolve(os.homedir(), '.codeleapcli.json')
let _userConf = {} as CodeleapCLIUserConfig

try {
  _userConf = JSON.parse(fs.readFileSync(
    cliConfigPath,
  ).toString()) as CodeleapCLIUserConfig
} catch (e) {

}
export const orgName = 'codeleap-uk'
export const USER_CONFIG = {
 SHELL: true,
  ... _userConf
}
export const MOBILE_TEMPLATE_URL = `git@github.com:${orgName}/mobile-template.git`

export const CODELEAP_CLI_SETTINGS_PATH = './codeleapcli.config.json'
