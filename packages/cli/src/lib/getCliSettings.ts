import { CODELEAP_CLI_SETTINGS_PATH } from '../constants'
import { CodeleapCLISettings } from '../types'
import { fs } from './utils'
let cachedSettings: CodeleapCLISettings = null

export function getCliSettings(required = true) {
  if (cachedSettings) {
    return cachedSettings
  }
  const settingsPath = CODELEAP_CLI_SETTINGS_PATH

  if (!fs.existsSync(settingsPath) && required) {
    console.error('Settings not found, check path:', settingsPath)
    process.exit(1)
    return
  }

  const settingsJSON = fs.readFileSync(settingsPath).toString()
  try {
    const settings: CodeleapCLISettings = JSON.parse(settingsJSON)
    cachedSettings = settings
    return settings
  } catch (e) {
    console.error('Error parsing settings, check path:', settingsPath)
    process.exit(1)

  }
}
