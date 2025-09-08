import React from 'react'
import { useEmptyPlaceholderContext } from '../context'
import { View } from '../../View'
import { logger } from '@codeleap/logger'
import { EmptyPlaceholderLoading } from './Loading'
import { EmptyPlaceholderButton } from './Button'
import { EmptyPlaceholderInfo } from './Info'
import { EmptyPlaceholderIllustration } from './Illustration'
import { EmptyPlaceholderProps } from '../types'

const orderMap: Record<EmptyPlaceholderProps['order'][0], any> = {
  illustration: EmptyPlaceholderIllustration,
  info: EmptyPlaceholderInfo,
  button: EmptyPlaceholderButton,
}

export const EmptyPlaceholderContent = ({ children }: React.PropsWithChildren) => {
  const { loading, styles, order } = useEmptyPlaceholderContext()

  if (loading) {
    return <EmptyPlaceholderLoading />
  }

  if (children) {
    return <View style={styles.wrapper}>{children}</View>
  }

  return (
    <View style={styles.wrapper}>
      {order.map(componentKey => {
        const Component = orderMap[componentKey]

        if (!Component) {
          logger.warn(`[EmptyPlaceholder] Component "${componentKey}" not found in orderMap`)
          return null
        }

        return <Component key={'emptyPlaceholder:' + componentKey} />
      })}
    </View>
  )
}
