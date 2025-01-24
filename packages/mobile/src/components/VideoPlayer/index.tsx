import React, { forwardRef, useState } from 'react'
import { AppIcon, IJSX, StyledComponentProps, StyledComponentWithProps, useCompositionStyles } from '@codeleap/styles'
import Player, { VideoRef } from 'react-native-video'
import { useStylesFor } from '../../hooks'
import { AnyRecord, TypeGuards } from '@codeleap/types'
import { VideoPlayerProps } from './types'
import { MobileStyleRegistry } from '../../Registry'
import { ActionIcon } from '../ActionIcon'
import { View } from '../View'
import { useBooleanToggle } from '@codeleap/hooks'

export * from './styles'
export * from './types'

export const VideoPlayer = forwardRef<VideoRef, VideoPlayerProps>((videoPlayerProps, ref) => {
  const {
    uri,
    style,
    closable = false,
    onClose,
    paused,
    ...props
  } = {
    ...VideoPlayer.defaultProps,
    ...videoPlayerProps,
  }
  const [started, toggle] = useBooleanToggle(false)

  const styles = useStylesFor(VideoPlayer.styleRegistryName, style)
  const compositionStyles = useCompositionStyles(['closeIcon', 'playIcon', 'controls', 'subtitle'], styles)

  const playerProps = !started ? { controls: false, paused: true } : { controls: true }

  if (!TypeGuards.isString(uri)) return null

  return (
    <View style={styles.wrapper}>
      {started ? null : (
        <ActionIcon
          debugName='VideoPlayer start'
          name={'play-circle-fill' as AppIcon}
          onPress={toggle}
          style={compositionStyles.playIcon}
        />
      )}

      {closable && started ? (
        <ActionIcon
          onPress={onClose}
          name={'x' as AppIcon}
          debugName='VideoPlayer close'
          style={compositionStyles.closeIcon}
        />
      ) : null}

      <Player
        ref={ref}
        source={{ uri: uri }}
        resizeMode={'contain'}
        style={styles.player}
        controlsStyles={compositionStyles.controls}
        subtitleStyle={compositionStyles.subtitle}
        {...props}
        {...playerProps}
      />
    </View>
  )
}) as StyledComponentWithProps<VideoPlayerProps>

VideoPlayer.styleRegistryName = 'VideoPlayer'
VideoPlayer.elements = ['wrapper', 'playIcon', 'closeIcon', 'player']
VideoPlayer.rootElement = 'wrapper'

VideoPlayer.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return VideoPlayer as (props: StyledComponentProps<VideoPlayerProps, typeof styles>) => IJSX
}

VideoPlayer.defaultProps = {
  closable: false,
  repeat: true,
} as Partial<VideoPlayerProps>

MobileStyleRegistry.registerComponent(VideoPlayer)
