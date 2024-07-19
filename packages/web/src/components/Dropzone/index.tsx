import { DropzoneFilePreviewProps, DropzoneInnerFilePreviewProps, DropzoneProps, DropzoneRef } from './types'
import { PropsOf, TypeGuards, onUpdate, useCallback } from '@codeleap/common'
import { FileRejection, useDropzone } from 'react-dropzone'
import { View, ViewProps } from '../View'
import { Text } from '../Text'
import { Icon } from '../Icon'
import { forwardRef, useImperativeHandle, useState, HTMLProps } from 'react'
import { ActionIcon } from '../ActionIcon'
import { useStylesFor } from '../../lib/hooks/useStylesFor'
import { WebStyleRegistry } from '../../lib/WebStyleRegistry'
import { AnyRecord, AppIcon, IJSX, StyledComponentProps, StyledComponentWithProps, useNestedStylesByKey } from '@codeleap/styles'

export * from './styles'
export * from './types'

function isImage(file) {
  return file?.type?.startsWith('image/')
}

const DefaultFilePreview = (props: DropzoneInnerFilePreviewProps) => {
  const {
    file,
    styles,
    errors = [],
    onRemove,
    fileLeftIcon,
    fileRightIcon,
    fileRightIconStyles,
    hasErrors,
    revokeImageUrl,
    imageUrl,
    isPreview,
  } = props

  const handleRemove = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation()
    onRemove?.()
  }

  return (
    <View style={[styles.fileWrapper, hasErrors && styles['fileWrapper:error']]}>
      {isPreview ? (
        <img
          onLoad={revokeImageUrl}
          src={imageUrl}
          css={styles.fileImage}
        />
      ) : (
        <Icon
          debugName='DropzoneFilePreview:LeftIcon'
          name={fileLeftIcon}
          style={styles.fileLeftIcon}
        />)
      }

      <View style={styles.fileNameWrapper}>
        <Text text={file.name} style={styles.fileName} />
        {hasErrors && errors?.map(error => <Text text={error.message} style={styles.fileError} />)}
      </View>

      <ActionIcon
        onPress={handleRemove}
        debugName='DropzoneFilePreview:RightIcon'
        name={fileRightIcon}
        style={fileRightIconStyles}
      />
    </View>
  )
}

const FilePreview = (props: DropzoneFilePreviewProps) => {
  const {
    file,
    withImagePreview,
    errors = [],
    FilePreviewComponent,
    ...rest
  } = props

  const hasErrors = errors?.length > 0
  const isPreview = withImagePreview && isImage(file)

  const [imageUrl, setImageUrl] = useState<string>()

  const revokeImageUrl = () => {
    URL.revokeObjectURL(imageUrl)
  }

  onUpdate(() => {
    if (isImage(file)) {
      setImageUrl(URL.createObjectURL(file))
    }
  }, [file])

  const _FilePreview = !TypeGuards.isNil(FilePreviewComponent) ? FilePreviewComponent : DefaultFilePreview

  return (
    <_FilePreview
      file={file}
      hasErrors={hasErrors}
      isPreview={isPreview}
      imageUrl={imageUrl}
      revokeImageUrl={revokeImageUrl}
      errors={errors}
      {...rest}
    />
  )
}

export const Dropzone = forwardRef<DropzoneRef, DropzoneProps>((props, ref) => {
  const {
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
    FilePreviewComponent,
    style,
    ...rest
  } = {
    ...Dropzone.defaultProps,
    ...props,
  }

  const styles = useStylesFor(Dropzone.styleRegistryName, style)

  const [rejectedFilesState, setRejectedFilesState] = useState<DropzoneProps['rejectedFiles']>([])
  const [rejectedFiles, setRejectedFiles] = [rejectedFilesProps || rejectedFilesState, setRejectedFilesProps || setRejectedFilesState]

  const fileRightIconStyles = useNestedStylesByKey('fileRightIcon', styles)

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

  const hasFiles = acceptedFiles?.length > 0 || rejectedFiles?.length > 0

  const fileProps = {
    fileLeftIcon,
    fileRightIcon,
    styles,
    withImagePreview,
    fileRightIconStyles,
  }

  return (
    <View style={styles.wrapper}>
      <View {...getRootProps() as PropsOf<ViewProps<'div'>>} style={styles.dropzone}>

        {icon && !hasFiles ? (
          <View style={styles.iconWrapper}>
            <Icon debugName='Dropzone:Icon' name={icon} style={styles.icon} />
          </View>
        ) : null}

        {hasFiles ? (
          <View style={styles.filesWrapper}>
            {acceptedFiles?.map?.((file, index) => (
              <FilePreview
                {...fileProps}
                index={index}
                file={file}
                key={file.name}
                onRemove={() => handleRemoveFile(file)}
                FilePreviewComponent={FilePreviewComponent}
              />))}

            {rejectedFiles?.map?.(({ file, errors }, index) => (
              <FilePreview
                {...fileProps}
                index={index}
                key={file.name}
                file={file}
                errors={errors}
                onRemove={() => handleRemoveFile(file, true)}
                FilePreviewComponent={FilePreviewComponent}
              />))}
          </View>
        ) : null}

        {children}

        {!!placeholder ? <Text text={placeholder} style={styles.placeholder} /> : null}

        <input {...getInputProps() as HTMLProps<HTMLInputElement>} />
      </View>
    </View>)
}) as StyledComponentWithProps<DropzoneProps>

Dropzone.styleRegistryName = 'Dropzone'

Dropzone.elements = [
  'wrapper',
  'dropzone',
  'icon',
  'placeholder',
  'filesWrapper',
  'fileWrapper',
  'fileLeftIcon',
  'fileName',
  'fileError',
  'fileErrors',
  'fileNameWrapper',
  'fileImage',
  'iconWrapper',
  `fileRightIcon`,
]

Dropzone.rootElement = 'wrapper'

Dropzone.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return Dropzone as (props: StyledComponentProps<DropzoneProps, typeof styles>) => IJSX
}

Dropzone.defaultProps = {
  icon: 'file-plus' as AppIcon,
  multiple: false,
  acceptedFiles: [],
  fileLeftIcon: 'file' as AppIcon,
  fileRightIcon: 'x' as AppIcon,
  withImagePreview: true,
} as Partial<DropzoneProps>

WebStyleRegistry.registerComponent(Dropzone)
