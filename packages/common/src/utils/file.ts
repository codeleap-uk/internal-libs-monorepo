const separators = /[\\\/.]+/

export function parseFilePathData(path: string) {
  const parts = path.split(separators)

  const fileName = parts[parts.length - 2]
  const filePath = path.split(fileName)[0]

  return {
    path: filePath,
    extension: parts[parts.length - 1],
    name: fileName,
  }
}
