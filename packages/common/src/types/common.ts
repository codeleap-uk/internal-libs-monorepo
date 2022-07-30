export type CancellablePromise<T> = Promise<T> & { abort?: () => void }

export type WebInputFile = {
  file: File
  preview: string
}

export type MobileFile = {
  fileCopyUri?: string
  name: string
  size: number
  type: string
  uri: string
}

export type FileWithPreview = {
  file: MobileFile
  preview: string
}

export type MobileInputFile = FileWithPreview | MobileFile
