import { sha256 } from 'js-sha256'

const styleKey = '@styles-version'
const version = require('../../package.json')?.version

/**
 * Generates a SHA-256 hash from an array with automatic version injection.
 * Appends package version to the array for cache invalidation purposes.
 * 
 * @param {Array<any>} value - Array to be hashed
 * @returns {string} SHA-256 hash string
 */
export const hashKey = (value: Array<any>): string => {
  value.push({ [styleKey]: version })

  const str = JSON.stringify(value)

  return sha256(str)
}
