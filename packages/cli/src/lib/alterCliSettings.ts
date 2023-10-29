import { CODELEAP_CLI_SETTINGS_PATH } from '../constants'
import { CodeleapCLISettings } from '../types'
import { fs } from './utils'
import { invalidateSettingsCache } from './getCliSettings'

export function alterCliSettings(updater: (settings: CodeleapCLISettings) => CodeleapCLISettings) {

  const settingsPath = CODELEAP_CLI_SETTINGS_PATH

  if (!fs.existsSync(settingsPath)) {
    console.error('Settings not found, check path:', settingsPath)
    process.exit(1)
    return
  }

  let settingsJSON = JSON.parse(fs.readFileSync(settingsPath).toString())

  settingsJSON = updater(settingsJSON)

  fs.writeFileSync(settingsPath, JSON.stringify(settingsJSON, null, 2))

  invalidateSettingsCache(settingsJSON)
}
