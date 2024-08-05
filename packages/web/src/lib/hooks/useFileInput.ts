import { useRef } from 'react'
import { FileInputRef } from '../../components/FileInput/types'

export const useFileInput = () => {
  const inputRef = useRef<FileInputRef | null>(null)

  const openFilePicker = () => {
    return inputRef.current?.openFilePicker()
  }

  return {
    openFilePicker,
    ref: inputRef,
  }
}
