import { Logger, LoggerTypes } from '@codeleap/common'
import { Settings } from './Settings'

export const logger = new Logger(Settings, [], null)

// @ts-ignore
global.logger = logger
