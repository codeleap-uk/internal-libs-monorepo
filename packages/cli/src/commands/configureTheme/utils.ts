import { USER_CONFIG, cliDir } from '../../constants'
import { fs, path } from '../../lib'
import { logObj, resolveJSON } from '../../utils'
import { ThemeShape, ThemeValue } from './types'

const isNil = (x) => x === null || typeof x === 'undefined'

function normalizeKey(key: string | number) {
  return String(key).replace(/[\/\s\:]/g, '_').replaceAll('__', '_').toLowerCase()
}

export const replaceDoubleQuotesWithSingle = (str: string) => str.replace(/"/g, "'")

export const transformObj = (obj) => replaceDoubleQuotesWithSingle(JSON.stringify(obj, null, 2))

export function createThemeFile<T extends Record<string, any>>(
  name: string,
  content: T,
  render: (name: string, content: T) => string = (name, content) => `export const ${name} = ${transformObj(content)}`
) {
  const TSContent = render(name, content)

  fs.writeFileSync(path.resolve(cliDir + USER_CONFIG.theme.configure.output, `${name}.ts`), TSContent)

  return content
}

function parseColor(color: ThemeValue) {
  if (typeof color !== 'object') return null

  const parts = []
  let mode = null

  if ([color.r, color.g, color.b].every(x => !isNil(x))) {
    const a = color.a
    const { r, g, b } = color
    const hasAlpha = !isNil(a)
    mode = hasAlpha ? 'rgba' : 'rgb'
    parts.push(r, g, b)
    if (hasAlpha) {
      parts.push(a)
    }
  }

  switch (mode) {
    case 'rgba':
      const values = parts.map((p, idx, arr) => {
        const skipMultiply = idx === arr.length - 1 && mode == 'rgba'
        if (skipMultiply) return p.toFixed(2)
        return Math.round(p * 255)
      }).join(', ')
      return `${mode}(${values})`
  }
}

// Measures

export function transformMeasure(shape: ThemeShape) {
  const ignoreVariables = ['spacing']

  return shape.variables.reduce((acc, variable) => {
    const [variableKey, key] = variable.name.split('/')

    if (ignoreVariables.includes(variableKey)) return acc

    if (!acc[variableKey]) acc[variableKey] = {}

    acc[variableKey][key] = Object.values(variable.valuesByMode)[0]

    return acc
  }, {})
}

export function resolveMeasure() {
  try {
    const measuresTokens = resolveJSON<ThemeShape>(config => config.theme.assets.measureTokens)

    return transformMeasure(measuresTokens)
  } catch (err) {
    console.log('[resolve] Measures error', err)
    return {}
  }
}

// Context Colors

function transformContextColors(shape: ThemeShape) {
  // logObj(shape)

  const colors = shape.variables.reduce((acc, variable) => {
    const key = normalizeKey(variable.name)

    Object.entries(variable.resolvedValuesByMode).forEach(([modeId, { aliasName }]) => {
      if (aliasName) {
        const modeName = normalizeKey(shape.modes[modeId])

        if (!acc[modeName]) acc[modeName] = {}

        const colorKey = normalizeKey(aliasName)

        acc[modeName][key] = colorKey
      }
    })

    return acc
  }, {} as Record<string, Record<string, string | null>>)

  for (const [modeName, values] of Object.entries(colors)) {
    const otherThemes = Object.entries(colors).filter(([k]) => k !== modeName)

    for (const colorKey in values) {
      const v = values[colorKey]
      if (isNil(v)) {
        values[colorKey] = otherThemes.find(([_, colors]) => colors?.[colorKey])?.[1]?.[colorKey]
      }
    }
  }

  return colors
}

export function resolveContextColors() {
  try {
    const contextColors = resolveJSON<ThemeShape>(config => config.theme.assets.contextColors)

    return transformContextColors(contextColors)
  } catch (err) {
    console.log('[resolve] Context colors error', err)
    return {}
  }
}

// Global colors

export function transformGlobalColors(shape: ThemeShape) {
  return Object.fromEntries(shape.variables.reduce((acc, variable) => {
    const key = normalizeKey(variable.name)

    const firstModeValue = variable.valuesByMode[Object.keys(variable.valuesByMode)[0]]
    const value = parseColor(firstModeValue)

    acc = [...acc, [key, value]]

    return acc
  }, []))
}

export function resolveGlobalColors() {
  try {
    const globalColors = resolveJSON<ThemeShape>(config => config.theme.assets.globalColors)

    return transformGlobalColors(globalColors)
  } catch (err) {
    console.log('[resolve] Global colors error', err)
    return {}
  }
}