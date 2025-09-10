import { compressToBase64, decompressFromBase64 } from 'lz-string'

export function compress(value: any): any {
  if (!value) return value
  
  return compressToBase64(JSON.stringify(value))
}

export function decompress(value: any): any {
  if (!value) return value

  const decoded = decompressFromBase64(value)

  return JSON.parse(decoded)
}

export const minifier = {
  compress,
  decompress,
}
