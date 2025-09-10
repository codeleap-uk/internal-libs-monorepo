import { compressToBase64, decompressFromBase64 } from 'lz-string'

/**
 * Compresses any value to a Base64 string using LZ compression.
 * Returns the original value if falsy.
 * 
 * @param {any} value - Value to compress
 * @returns {string|any} Compressed Base64 string or original falsy value
 */
export function compress(value: any): any {
  if (!value) return value
  
  return compressToBase64(JSON.stringify(value))
}

/**
 * Decompresses a Base64 string back to its original value.
 * Returns the original value if falsy.
 * 
 * @param {any} value - Compressed Base64 string to decompress
 * @returns {any} Original decompressed value or original falsy value
 */
export function decompress(value: any): any {
  if (!value) return value

  const decoded = decompressFromBase64(value)

  return JSON.parse(decoded)
}

/**
 * Utility object containing compress and decompress functions.
 * Useful for data compression/decompression operations.
 */
export const minifier = {
  compress,
  decompress,
}
