import { IconPlaceholder, useStyle } from '@codeleap/common'

export type IconProps = {
    name:IconPlaceholder
    style?: {
      color: string
      size:string|number
    }

}

export const Icon:React.FC<IconProps> = ({name, style}) => {
  const {Theme} = useStyle()
  if (!name) return null
  const Component = Theme?.icons?.[name]

  if (!Component) throw new Error(`No icon found in theme for name "${name}"`)
  return <Component style={style}/>
}
