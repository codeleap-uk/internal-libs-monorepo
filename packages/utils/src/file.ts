const separators = /[\\\/]+/

export function parseFilePathData(path: string) {
  const parts = path.split(separators)

  const lastPart = parts[parts.length - 1]

  let fileName = lastPart
  let ext = ''

  if (lastPart.includes('.')) {
    const dotIdx = fileName.lastIndexOf('.')
    fileName = fileName.substring(0, dotIdx)

    ext = lastPart.substring(dotIdx + 1)
  }

  return {
    path: parts.slice(0, -1).join('/'),
    extension: ext,
    name: fileName,
  }
}
