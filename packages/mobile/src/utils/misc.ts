import { MobileInputFile, parseFilePathData } from '@codeleap/common'

export const stringToFile = (str: string): MobileInputFile => {
  if (!str) {
    return {
      file: null,
      preview: null,
    }
  }
  const fileData = parseFilePathData(str)

  const data: MobileInputFile['file'] = {
    name: fileData.name,
    type: 'image/' + fileData.extension,
    size: 1000,
    uri: str,
    fileCopyUri: str,
  }

  return {
    file: data,
    preview: data.uri,
  }
}
