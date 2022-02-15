import { IconPlaceholder } from '@codeleap/common'
import { Navigators } from './constants'
  

export type TNavigators = typeof Navigators
export type NavigatorType = keyof TNavigators

export type PropTypes = {
    [P in NavigatorType] : {
        Screen: Omit<React.ComponentPropsWithRef<TNavigators[P]['Screen']>, 'children'>
        Navigator: Omit<React.ComponentPropsWithRef<TNavigators[P]['Navigator']>, 'children'>
        Group: Omit<React.ComponentPropsWithRef<TNavigators[P]['Group']>, 'children'>
    }
}


export type NavigationProps<T extends NavigatorType> = {
    type: T
    scenes: Scenes<T>
} & PropTypes[T]['Navigator']

export type SceneProps = any

export type SceneComponent<K extends NavigatorType> = PropTypes[K]['Screen']['component']
export type SceneOptions<K extends NavigatorType> = 
{ icon?: IconPlaceholder; default?:SceneComponent<K> } & PropTypes[K]['Screen']  
export type Scene<K extends NavigatorType> =  SceneComponent<K>  | SceneOptions<K>

export type Scenes<K extends NavigatorType> = {
    [x:string] : Scene<K>
}
