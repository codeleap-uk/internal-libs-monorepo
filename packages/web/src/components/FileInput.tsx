/** @jsx jsx */
import { jsx, CSSObject } from '@emotion/react'
import React, {
  useImperativeHandle,
  useRef,
} from 'react'
import { WebInputFile } from '@codeleap/common'
import { HTMLProps } from '../types'

export type FileInputRef = {
  openFilePicker: () => Promise<WebInputFile[]>
  clear: () => void
}

export type FileInputProps = Omit<HTMLProps<'input'>, 'type' | 'ref'> & {
  onFileSelect?: (files: WebInputFile[]) => void
}

export const _FileInput = (inputProps: FileInputProps, ref: React.Ref<FileInputRef>) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const { onFileSelect, ...props } = inputProps

  const resolveWithFile = useRef<(file: WebInputFile[]) => any>()

  useImperativeHandle(ref, () => ({
    openFilePicker: () => {
      inputRef.current.click()

      return new Promise<WebInputFile[]>((resolve) => {
        resolveWithFile.current = resolve
      })
    },
    clear: () => {
      if (!inputRef.current) return
      inputRef.current.value = null
    },
  }))

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files.length) return
    inputProps.onChange && inputProps.onChange(e)
    const fileArray = Array.from(e.target?.files || []) as File[]

    const files: WebInputFile[] = fileArray.map((obj) => ({
      file: obj,
      preview: URL.createObjectURL(obj),
    }))

    onFileSelect && onFileSelect(files)

    if (resolveWithFile.current) {
      resolveWithFile.current(files)
      resolveWithFile.current = undefined
    }
  }

  return (
    <input
      type={'file'}
      css={{ visibility: 'hidden', width: 0, height: 0, opacity: 0, display: 'none' }}
      {...props}
      ref={inputRef}
      onChange={handleChange}
    />
  )
}

export const FileInput = React.forwardRef<FileInputRef, FileInputProps>(_FileInput) as unknown as (
  (props: FileInputProps & { ref?: React.MutableRefObject<FileInputRef> | React.Ref<FileInputRef> }) => JSX.Element
)

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
