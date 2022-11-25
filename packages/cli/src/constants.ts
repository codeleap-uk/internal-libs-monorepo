import path from 'path'
import fs from 'fs'
import os from 'os'
import { CodeleapCLIUserConfig } from './types'
const _cwd = process.cwd()
export const isDev = process.env.CODELEAP_CLI_DEV_MODE == 'true'
export const cwd = isDev ? 'C:/Users/Paulo/Desktop/Tudo/Projetos/codeleap/cli-test' : path.join(
  _cwd,
  isDev ? 'tests' : '',
)
process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(cwd, 'gcp-automation.json')
export const MOBILE_TEMPLATE_URL = 'git@github.com:codeleap-uk/mobile-template.git'

export const cliConfigPath = path.resolve(os.homedir(), '.codeleapcli.json')
// export const orgName = 'codeleap-uk'
let _userConf = {} as CodeleapCLIUserConfig

try {
  _userConf = JSON.parse(fs.readFileSync(
    cliConfigPath,
  ).toString()) as CodeleapCLIUserConfig
} catch (e) {

}
export const orgName = 'EuthymiaCode'
export const USER_CONFIG = _userConf
