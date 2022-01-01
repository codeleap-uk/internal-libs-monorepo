import React, {  ComponentPropsWithoutRef,  useImperativeHandle, useRef } from 'react'

type InputFile = {
  file:File
  preview: string
}

export type FileInputRef = {
    openFilePicker: () => void
}

type FileInputProps= Omit<ComponentPropsWithoutRef<'input'>, 'type'> & {
  onFileSelect(files:InputFile[]|InputFile): void
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
    const fileArray = Array.from(e.target?.files||[])
    
    const files:InputFile[] = fileArray.map((obj) => ({
      file: obj,
      preview: URL.createObjectURL(obj),
    }))



    onFileSelect && onFileSelect( props.multiple ? files : files[0])

  }

  return <input type={'file'} css={{visibility: 'hidden'}} {...props} ref={inputRef} onChange={handleChange}/>
})





