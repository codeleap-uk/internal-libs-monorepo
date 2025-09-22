import React from 'react'
import { useAvatarContext } from '../context'
import { View } from '../../View'
import { Text } from '../../Text'

export const AvatarDescription = () => {
  const { description, styles } = useAvatarContext()
  if (!description) return null

  return (
    <View style={styles.descriptionOverlay}>
      <Text text={description} style={styles.description} />
    </View>
  )
}
