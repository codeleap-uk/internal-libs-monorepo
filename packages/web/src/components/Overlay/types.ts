import { StyledProp } from '@codeleap/styles'
import { ViewProps } from '../View'
import { OverlayComposition } from './styles'
import { TouchableProps } from '../Touchable'
import { NativeHTMLElement } from '../../types'

export type OverlayProps<T extends NativeHTMLElement = 'div'> = {
    visible?: boolean
    style?: StyledProp<OverlayComposition>
    onPress?: TouchableProps<'div'>['onClick']
  } & ViewProps<T>

