import { React, Theme, View, Icon, ActivityIndicator, Modal, variantProvider, Image, logger } from '@/app'
import { AppStatus, TAppStatus, useAppSelector } from '@/redux'
import { onUpdate } from '@codeleap/common'
import { AppIcon } from '@/app/assets/icons'
import { Logo } from '@/components'
import splash from '@/images/splash.png'

const backdropStatuses = ['splash', 'blank']

export const AppStatusOverlay: React.FC = () => {
  const { status } = useAppSelector((store) => store.AppStatus)
  // const status = 'loading'

  // logger.log('render', status, 'AppStatusOverlay')

  const backdropVisible = backdropStatuses.includes(status)

  onUpdate(() => {
    let timeout = null
    if (status === 'done') {
      timeout = setTimeout(() => {
        AppStatus.set('idle')
      }, 3000)
    }
    return () => {
      if (timeout) {
        clearTimeout(timeout)
      }
    }
  }, [status])

  const pose = backdropVisible ? 'init' : 'hide'
  const pointerEvents = backdropVisible ? 'auto' : 'none'

  const renderSplash = () => {
    return <Logo/>
  }

  const renderDone = () => {
    return <Icon name='checkmark' size={30} />
  }

  const renderLoading = () => {
    return <ActivityIndicator size={'small'} color={Theme.colors.primary} />
  }

  const renderContentModal = ({ visible, content, variants = 'appStatusIndicator' }) => {
    return (
      <Modal visible={visible} variants={variants} scroll={false} debugName={'AppStatus modal'}>
        {content()}
      </Modal>
    )
  }

  return (
    <>
      {/* <Animated
        component='View'
        pose={pose}
        config={animationConfig}
        style={styles.image}
        pointerEvents={pointerEvents}
      >
        <Image source={splash} style={styles.image} resizeMode={'cover'}/>
      </Animated> */}
      {/* NOTE All items must be rendered in separate modals so they are rendered correctly */}
      {renderContentModal({ visible: status === 'splash', content: renderSplash, variants: 'appStatusOverlay' })}
      {renderContentModal({ visible: status === 'done', content: renderDone })}
      {renderContentModal({ visible: status === 'loading', content: renderLoading })}
    </>
  )
}

const transition = {
  duration: 500,
}

const animationConfig =  {
  init: {
    opacity: 1,
    transition,
  },
  hide: {
    opacity: 0,
    transition,
  },
}

const styles = variantProvider.createComponentStyle({
  wrapper: {
    position: 'relative',
    ...Theme.presets.full,
    ...Theme.presets.center,
  },
  image: {
    ...Theme.presets.absolute,
    ...Theme.presets.whole,
  },
}, true)
