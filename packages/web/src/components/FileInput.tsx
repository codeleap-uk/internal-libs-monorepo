import React, {  ComponentPropsWithoutRef,  useImperativeHandle, useRef } from 'react'
import { WebInputFile } from '@codeleap/common'


export type FileInputRef = {
    openFilePicker: () => void
}

type FileInputProps= Omit<ComponentPropsWithoutRef<'input'>, 'type'> & {
  onFileSelect(files:WebInputFile[]): void
} 


 
export const FileInput = React.forwardRef<FileInputRef, FileInputProps>((inputProps, ref) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const { onFileSelect, ...props } = inputProps

  useImperativeHandle(ref, () => ({
    openFilePicker: () => {
      inputRef.current.click()
    },
  }))
 


  function handleChange(e:React.ChangeEvent<HTMLInputElement>){
    if (!e.target.files.length) return
    inputProps.onChange && inputProps.onChange(e)
    const fileArray = Array.from(e.target?.files||[]) as File[]
    
    const files:WebInputFile[] = fileArray.map((obj) => ({
      file: obj,
      preview: URL.createObjectURL(obj),
    }))

    onFileSelect && onFileSelect(files)

  }

  return <input type={'file'} css={{visibility: 'hidden'}} {...props} ref={inputRef} onChange={handleChange}/>
})





