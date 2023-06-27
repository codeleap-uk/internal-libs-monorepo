export type CancellablePromise<T> = Promise<T> & { abort?: () => void }

export type WebInputFile = {
  file: File
  preview: string
}

type MobileFileBase = {
  fileCopyUri?: string
  name: string
  size: number
  type: string
  uri: string
}

export type MobileFile<Extra = {}> = Omit<MobileFileBase, keyof Extra> & Partial<Extra>

export type FileWithPreview<Extra = {}> = {
  file: MobileFile<Extra>
  preview: string
}

export type MobileInputFile<Extra = {}> = FileWithPreview<Extra> | MobileFile<Extra>
