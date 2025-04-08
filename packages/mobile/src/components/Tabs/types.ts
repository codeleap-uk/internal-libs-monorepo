import { ICSS, StyledProp } from '@codeleap/styles'
import { ReactNode } from 'react'
import { TabsComposition } from './styles'
import { ViewProps } from '../View'

export type TabsContextProps = {
  defaultValue: string
  value?: string
  onValueChange?: (newValue: string) => void
  children?: ReactNode
  keepMounted?: boolean
  withWrapper?: boolean
}

export type TabsProps =
  TabsContextProps &
  Omit<ViewProps, 'style'> &
  {
    style?: StyledProp<TabsComposition>
  }

export type TabsStyles = Record<TabsComposition, ICSS>

export type TabPropsWithCtx<P> = P & {
  active?: boolean
  setValue?: (value: string) => void
  styles: TabsStyles
}