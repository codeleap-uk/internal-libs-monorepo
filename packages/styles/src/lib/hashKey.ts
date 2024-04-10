const styleKey = '@styles-version'
const version = require('../../package.json')?.version

export const hashKey = (value: Array<any> | object) => {
  if (typeof value == 'object') {
    value[styleKey] = version
  }

  if (Array.isArray(value)) { 
    value.push({ [styleKey]: version })
  }

  return JSON.stringify(value)
}
