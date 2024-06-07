/** @jsx jsx */
import React, { forwardRef, useImperativeHandle, useRef } from 'react'
import { WebInputFile, useCallback } from '@codeleap/common'
import { FileInputProps, FileInputRef } from './types'
import { ComponentWithDefaultProps } from '../../types'

export const FileInput = forwardRef((props: FileInputProps, ref: React.Ref<FileInputRef>) => {

  const inputRef = useRef<HTMLInputElement>(null)

  const {
    onFileSelect,
    autoClear,
    ...inputProps
  } = {
    ...FileInput.defaultProps,
    ...props,
  }

  const resolveWithFile = useRef<(file: WebInputFile[]) => any>()

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
    inputProps.onChange && inputProps.onChange(e)
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

    if (autoClear) {
      clearInput()
    }
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
}) as ComponentWithDefaultProps<FileInputProps>

FileInput.defaultProps = {
  autoClear: true,
} as Partial<FileInputProps>

export * from './types'
