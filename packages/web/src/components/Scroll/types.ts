import { NativeHTMLElement } from '../../types'
import { ViewProps } from '../View'

export type ScrollComponentProps = {
    scrollProps: ScrollProps<'div'>
    ref: React.Ref<any>
  }

export type ScrollProps<T extends NativeHTMLElement> = ViewProps<T>
