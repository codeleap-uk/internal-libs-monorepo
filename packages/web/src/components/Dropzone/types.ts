import { ComponentVariants, PropsOf, StylesOf } from '@codeleap/common'
import { DropzoneComposition, DropzonePresets } from './styles'
import { View } from '../View'

export type DropzoneProps = ComponentVariants<typeof DropzonePresets> & {
  styles?: StylesOf<DropzoneComposition>
  style?: PropsOf<typeof View>['style']
}
