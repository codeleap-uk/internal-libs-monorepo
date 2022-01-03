import { standardizeVariants, ViewStyles } from '@codeleap/common'
import { ActivityIndicator } from '.'
import { ViewProps, View } from './View'
import { Text } from './Text'

export type ContentViewProps<V = ViewProps<'div'>['variants']> = Omit<ViewProps<'div'>, 'variants'> & {
    placeholderMsg: string
    loading?:boolean
    variants?: V
} 

const WrapContent = ({children, variants, ...props}:Partial<ContentViewProps<(keyof typeof ViewStyles)[]>>) => <View {...props} 
  variants={['padding:2', ...variants]}>{children}</View>

export const ContentView:React.FC<ContentViewProps> = (rawProps) => {
  const {
    children,
    placeholderMsg,
    loading,
    variants,
    ...props
  } = rawProps
  
  const arrayVariants = standardizeVariants(variants) as (keyof typeof ViewStyles)[]
    
  if (loading){
    return <WrapContent {...props} variants={['center', ...arrayVariants]}>
      <ActivityIndicator size={60}/>
    </WrapContent>
  }
  const hasChildren = Object.keys(children||{}).length > 0
  if (hasChildren){
    return <WrapContent {...props} variants={arrayVariants}>
      {children}
    </WrapContent>
  }

  return <WrapContent {...props} variants={arrayVariants}>
    <Text text={placeholderMsg} />
  </WrapContent>
    
}
