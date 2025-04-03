import { ReactNode } from 'react'
import { useTabContext } from './Context'
import { memoBy } from '@codeleap/utils'
import { TabPropsWithCtx } from './types'
import { View, ViewProps } from '../View'
import { ICSS } from '@codeleap/styles'

type PanelProps = Omit<ViewProps, 'style'> & {
  value: string
  children: ReactNode
  style?: ICSS
  keepMounted?: boolean
}

const PanelMemoized = memoBy((props: TabPropsWithCtx<PanelProps>) => {
  const { children } = props

  return <>{children}</>
}, ['children', 'styles'])

export const Panel = ({ keepMounted: panelKeepMounted = true, ...props }: PanelProps) => {
  const { value, styles, keepMounted } = useTabContext()

  const active = value === props.value

  if (!keepMounted && !active || !panelKeepMounted && !active) return null

  return <View style={[styles?.panel, props?.style, { display: active ? 'flex' : 'none' }]}>
    <PanelMemoized {...props} styles={styles} />
  </View>
}