import { WebInputFile } from '@codeleap/common'
import { HTMLProps } from '../../types'

export type FileInputRef = {
  openFilePicker: () => Promise<WebInputFile[]>
  clear: () => void
}

export type FileInputProps = 
  Omit<HTMLProps<'input'>, 'type' | 'ref'> & 
  {
    onFileSelect?: (files: WebInputFile[]) => void
    autoClear?: boolean
  }
