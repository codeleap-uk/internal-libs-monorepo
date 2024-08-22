import { sha256 } from 'js-sha256'

const styleKey = '@styles-version'
const version = require('../../package.json')?.version

export const hashKey = (value: Array<any>): string => {
  value.push({ [styleKey]: version })

  const str = JSON.stringify(value)

  return sha256(str)
}
