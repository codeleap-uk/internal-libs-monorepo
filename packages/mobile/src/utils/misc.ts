import { MobileFile, MobileInputFile, FileWithPreview, TypeGuards } from '@codeleap/types'
import { parseFilePathData } from '@codeleap/utils'

export const stringToFile = (str: string): MobileInputFile => {
  if (!str) {
    return {
      file: null,
      preview: null,
    }
  }
  const fileData = parseFilePathData(str)

  const data: MobileFile = {
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

export function toMultipartFile(file: MobileInputFile) {
  // const inputFile = file as MobileInputFile
  const withPreview = file as FileWithPreview
  if (!!withPreview?.file) {
    return withPreview.file
  }

  return file as MobileFile
  // const fileData:MobileFile =  ? inputFile.file : (file as RNFile)
  // // const extension = parseFilePathData(fileData.uri).extension
  // // const isImage =DocumentPicker..includes(extension)
  // return fileData as unknown as Blob
  // // if (isImage) {
  // //   return {
  // //     uri: fileData.uri,
  // //     name: `image_${fileData.uri}`,
  // //     type: `image/${extension}`,
  // //   } as unknown as Blob
  // // } else {
  // //   return fileData as unknown as Blob
  // // }
}

export function isFile(param:any): param is MobileInputFile {

  let file = param
  try {
    if (typeof param?.preview !== 'undefined' && typeof param?.file !== 'undefined') {
      file = param.file
    }
    const keys = Object.keys(file)

    return ['uri', 'name', 'type'].every(key => keys.includes(key))

  } catch (e) {
    return false
  }
}

export function toMultipart(body, defaultFileValue = 'null') {
  const form = new FormData()

  for (const [key, value] of Object.entries(body)) {
    let formValue = null
    if (Array.isArray(value) && value.every(isFile)) {
      formValue = value.map((file) => form.append(key, toMultipartFile(file)))
    } else if (isFile(value)) {
      formValue = toMultipartFile(value)
    } else if (key === 'files' && typeof value === 'object') {

      if (TypeGuards.isNil(value)) {
        form.append(key, defaultFileValue)
      } else {

        for (const [filename, file] of Object.entries(value)) {
          form.append(filename, toMultipartFile(file))
        }
      }

    } else if (typeof value === 'object') {
      formValue = JSON.stringify(value)
    } else {
      formValue = String(value) as string
    }
    form.append(key, formValue)
  }

  return form
}

export function getFileMimeType(uri: string) {
  const extension = uri.split('.').pop().toLowerCase()

  const mimeTypes = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    pdf: 'application/pdf',
    txt: 'text/plain',
    mp4: 'video/mp4',
  }

  return mimeTypes[extension] || 'application/octet-stream'
}

export function getFileInfo(uri: string) {
  const fileName = uri.split('/').pop()
  const fileType = getFileMimeType(fileName)

  return {
    name: fileName,
    type: fileType,
    uri: uri,
  }
}
