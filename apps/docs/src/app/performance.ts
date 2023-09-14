import { makePerformanceInspector } from '@codeleap/common'
import { Settings } from './Settings'

export const perf = makePerformanceInspector(Settings)

// @ts-ignore
global.perf = perf