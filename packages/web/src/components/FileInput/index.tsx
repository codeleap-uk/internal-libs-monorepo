import React, { forwardRef, useImperativeHandle, useRef } from 'react'
import { TypeGuards, WebInputFile } from '@codeleap/types'
import { useCallback } from '@codeleap/hooks'
import { FileInputProps, FileInputRef } from './types'

export * from './types'

export const FileInput = (props: FileInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const {
    onFileSelect,
    autoClear,
    onChange,
    ref,
    ...inputProps
  } = {
    ...FileInput.defaultProps,
    ...props,
  }

  const resolveWithFile = useRef<(file: WebInputFile[]) => any>(undefined)

  const clearInput = useCallback(() => {
    if (!inputRef.current) return
    inputRef.current.value = null
  }, [])

  useImperativeHandle(ref, () => ({
    openFilePicker: () => {
      inputRef.current.click()

      return new Promise<WebInputFile[]>((resolve) => {
        resolveWithFile.current = resolve
      })
    },
    clear: clearInput,
  }))

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files.length) return
    if (TypeGuards.isFunction(onChange)) onChange(e)

    const fileArray = Array.from(e.target?.files || []) as File[]

    const files: WebInputFile[] = fileArray.map((obj) => ({
      file: obj,
      preview: URL.createObjectURL(obj),
    }))

    onFileSelect && onFileSelect(files)

    if (resolveWithFile.current) {
      await resolveWithFile.current(files)
      resolveWithFile.current = undefined
    }

    if (autoClear) clearInput()
  }

  return (
    <input
      type={'file'}
      style={{ visibility: 'hidden', width: 0, height: 0, opacity: 0, display: 'none' }}
      {...inputProps}
      ref={inputRef}
      onChange={handleChange}
    />
  )
}

FileInput.defaultProps = {
  autoClear: true,
} as Partial<FileInputProps>
