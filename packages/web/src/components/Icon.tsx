pimport { IconPlaceholder, useStyle } from '@codeleap/common'

export type IconProps = {
    name:IconPlaceholder
    style?: {
      color: string
      size?:string|number
      width?:string|number
      height?:string|number
    }

}

export const Icon:React.FC<IconProps> = ({name, style}) => {
  const {Theme} = useStyle()
  if (!name) return null
  const Component = Theme?.icons?.[name]
  
  const {logger} = useStyle()

  if (!Component) {
    logger.warn('Icon', `No icon found in theme for name "${name}"`, 'Component')
    return null
  }
  return <Component style={style}/>
}
