import { DropzoneProps } from './types'
import { DropzonePresets } from './styles'
import { useDefaultComponentStyle } from '@codeleap/common'

const defaultProps: Partial<DropzoneProps> = {}

export const Dropzone = (props: DropzoneProps) => {
  const allProps = {
    ...Dropzone.defaultProps,
    ...props,
  }

  const { responsiveVariants, styles, variants } = allProps

  const variantStyles = useDefaultComponentStyle<'u:Dropzone', typeof DropzonePresets>('u:Dropzone', {
    responsiveVariants,
    variants,
    styles,
    rootElement: 'wrapper',
  })

  return <div style={variantStyles.wrapper}>Dropzone</div>
}

export * from './styles'
export * from './types'

Dropzone.defaultProps = defaultProps
