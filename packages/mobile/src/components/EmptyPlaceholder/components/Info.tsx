import React from 'react'
import { Text } from '../../Text'
import { EmptyPlaceholderInfoProps } from '../types'
import { useEmptyPlaceholderContext } from '../context'

export const EmptyPlaceholderInfo = (props: EmptyPlaceholderInfoProps) => {
  const { title, description, styles, itemName } = useEmptyPlaceholderContext(props)

  const emptyText = title || (itemName && `No ${itemName} found.`)

  return <>
    {title || itemName ? <Text text={emptyText} style={styles.title} /> : null}
    {description ? <Text text={description} style={styles.description} /> : null}
  </>
}
