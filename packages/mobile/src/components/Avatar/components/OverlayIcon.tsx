import { useAvatarContext } from '../context'
import { AvatarOverlayIconProps } from '../types'
import { Touchable } from '../../Touchable'
import { Icon } from '../../Icon'

export const AvatarOverlayIcon = (props: AvatarOverlayIconProps) => {
  const { overlayIcon, styles, onPressOverlayIcon, ...touchableProps } = useAvatarContext(props)

  if (!overlayIcon) return null

  return (
    <Touchable
      debugName='avatar:overlayIcon'
      onPress={onPressOverlayIcon}
      noFeedback
      {...touchableProps}
      style={styles.overlayIconWrapper}
    >
      <Icon name={overlayIcon} style={styles.overlayIcon} />
    </Touchable>
  )
}
