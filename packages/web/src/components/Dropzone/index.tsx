import { DropzoneFilePreviewProps, DropzoneProps, DropzoneRef } from './types'
import { DropzonePresets } from './styles'
import { IconPlaceholder, PropsOf, onUpdate, useCallback, useDefaultComponentStyle, useNestedStylesByKey, useRef } from '@codeleap/common'
import { FileRejection, useDropzone } from 'react-dropzone'
import { View, ViewProps } from '../View'
import { Text } from '../Text'
import { Icon } from '../Icon'

import { forwardRef, useImperativeHandle, useState, HTMLProps } from 'react'
import { ActionIcon } from '../ActionIcon'

const defaultProps: Partial<DropzoneProps> = {
  icon: 'file-plus' as IconPlaceholder,
  multiple: false,
  acceptedFiles: [],
  fileLeftIcon: 'file' as IconPlaceholder,
  fileRightIcon: 'x' as IconPlaceholder,
  withImagePreview: true,

}

function isImage(file) {
  return file?.type?.startsWith('image/')
}

const FilePreview = ({
  file,
  variantStyles,
  withImagePreview,
  errors = [],
  onRemove,
  fileLeftIcon,
  fileRightIcon,
  fileRightIconStyles,
}: DropzoneFilePreviewProps) => {
  const hasErrors = errors?.length > 0
  const _isImage = isImage(file)
  const isPreview = withImagePreview && _isImage

  const [imageUrl, setImageUrl] = useState()

  const revokeImageUrl = () => {
    URL.revokeObjectURL(imageUrl)
  }

  onUpdate(() => {
    if (_isImage) setImageUrl(URL.createObjectURL(file))
  }, [file, _isImage])

  return (
    <View css={[variantStyles.fileWrapper, hasErrors && variantStyles['fileWrapper:error']]}>
      {isPreview ?
        <img
          onLoad={revokeImageUrl}
          src={imageUrl}
          css={variantStyles.fileImage}
        />
        :
        <Icon
          debugName='DropzoneFilePreview:LeftIcon'
          name={fileLeftIcon}
          css={variantStyles.fileLeftIcon}
        />
      }

      <View css={variantStyles.fileNameWrapper}>
        <Text text={file.name} css={variantStyles.fileName} />
        {hasErrors && errors?.map(error => <Text text={error.message} css={variantStyles.fileError} />)}
      </View>

      <ActionIcon
        onClick={e => {
          e.stopPropagation()
          onRemove?.()
        }} debugName='DropzoneFilePreview:RightIcon'
        name={fileRightIcon}
        styles={fileRightIconStyles}
      />
    </View>)
}

const DropzoneComponent = (props: DropzoneProps, ref: React.ForwardedRef<DropzoneRef>) => {
  const allProps = {
    ...defaultProps,
    ...props,
  }
  const {
    responsiveVariants,
    styles,
    variants,
    icon,
    placeholder,
    multiple,
    acceptedFiles,
    setAcceptedFiles,
    rejectedFiles: rejectedFilesProps,
    setRejectedFiles: setRejectedFilesProps,
    fileLeftIcon,
    fileRightIcon,
    withImagePreview,
    onDrop,
    onRemove,
    children,
    ...rest } = allProps

  const [rejectedFilesState,
    setRejectedFilesState] = useState<DropzoneProps['rejectedFiles']>([])
  const [rejectedFiles, setRejectedFiles] = [rejectedFilesProps || rejectedFilesState, setRejectedFilesProps || setRejectedFilesState]

  const variantStyles = useDefaultComponentStyle<'u:Dropzone',
    typeof DropzonePresets>('u:Dropzone', {
      responsiveVariants,
      variants,
      styles,
      rootElement: 'wrapper',
    })

  const fileRightIconStyles = useNestedStylesByKey('fileRightIcon', variantStyles)

  const handleDrop = useCallback((newAcceptedFiles: File[], newRejectedFiles: FileRejection[], event) => {
    setRejectedFiles(newRejectedFiles)
    setAcceptedFiles?.(state => multiple ? [...state, ...newAcceptedFiles] : newAcceptedFiles)
    onDrop?.(newAcceptedFiles, newRejectedFiles, event)
  }, [onDrop, setAcceptedFiles])

  const handleRemoveFile = useCallback((file: File, isRejected = false) => {
    if (!isRejected) {
      setAcceptedFiles?.(state => state.filter(f => f.name !== file.name))
    } else {
      setRejectedFiles(state => state.filter(f => f.file.name !== file.name))
    }
  }, [setAcceptedFiles])

  const { getRootProps, getInputProps, open } = useDropzone({
    ...rest,
    multiple,
    onDrop: handleDrop,
  })

  const clear = useCallback(() => {
    setAcceptedFiles?.([])
    setRejectedFiles([])
  }, [setAcceptedFiles])

  useImperativeHandle(ref, () => ({
    clear,
    open,
  }))

  const hasFiles = acceptedFiles.length > 0 || rejectedFiles.length > 0

  const fileProps = {
    fileLeftIcon,
    fileRightIcon,
    variantStyles,
    withImagePreview,
    fileRightIconStyles,
  }

  return (
    <View css={variantStyles.wrapper}>
      <View {...getRootProps() as PropsOf<ViewProps<'div'>>} css={variantStyles.dropzone}>

        {icon && !hasFiles &&
          <View css={variantStyles.iconWrapper}>
            <Icon debugName='Dropzone:Icon' name={icon} css={variantStyles.icon} />
          </View>
        }

        {hasFiles && (
          <View css={variantStyles.filesWrapper}>
            {acceptedFiles.map(file => (
              <FilePreview
                {...fileProps}
                file={file}
                key={file.name}
                onRemove={() => handleRemoveFile(file)}
              />))}

            {rejectedFiles.map(({ file, errors }) => (
              <FilePreview
                {...fileProps}
                key={file.name}
                file={file}
                errors={errors}
                onRemove={() => handleRemoveFile(file, true)}
              />))}
          </View>
        )}

        {children}
        {!!placeholder && <Text text={placeholder} css={variantStyles.placeholder} />}

        <input {...getInputProps() as HTMLProps<HTMLInputElement>} />
      </View>
    </View>)
}

export * from './styles'
export * from './types'

DropzoneComponent.defaultProps = defaultProps

export const Dropzone = forwardRef(DropzoneComponent)
