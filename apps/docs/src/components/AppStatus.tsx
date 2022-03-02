import { React, Theme, Icon, ActivityIndicator, variantProvider, Overlay, View } from '@/app'
import { AppStatus, useAppSelector } from '@/redux'
import { onUpdate } from '@codeleap/common'

export const AppStatusOverlay: React.FC = () => {
  const { status } = useAppSelector((store) => store.AppStatus)

  onUpdate(() => {

    if (status === 'done') {
      setTimeout(() => {
        AppStatus.set('idle')
      }, 2000)
    }

  }, [status])

  const visibilityStyle = (appStatus) => {
    const isStatusVisible = status === appStatus
    return ({
      transform: `scale(${ isStatusVisible ? 1 : 0})`,
      transition: 'transform 0.3s ease',
      // visibility: isStatusVisible ? 'visible' : 'hidden',
    })
  }
  return (
    <>
      <Overlay visible={status !== 'idle'} styles={{ wrapper: { zIndex: Theme.values.zIndex.appStatusOverlay }}}/>
      <View css={[styles.wrapper]}>
        <Icon name='checkmark' variants={['large', 'primary']} style={visibilityStyle('done')}/>
        <ActivityIndicator styles={{ wrapper: visibilityStyle('loading') }}/>
      </View>
    </>
  )
}

const styles = variantProvider.createComponentStyle((theme) => ({
  wrapper: {
    ...Theme.presets.absolute,
    ...Theme.presets.whole,
    ...Theme.presets.justifyCenter,
    ...Theme.presets.alignCenter,
    zIndex: theme.values.zIndex.appStatusOverlay,
    pointerEvents: 'none',
    transition: 'transform 0.3s ease',
  },
  icon: {

  },
}), true)
