import { React, Theme, Icon, ActivityIndicator, Modal, variantProvider, Overlay, View } from '@/app'
import { AppStatus, useAppSelector } from '@/redux'
import { onUpdate } from '@codeleap/common'
import { Logo } from '@/components'

const renderStatus = {
  idle: () => <Icon name='checkmark' variants={['large', 'primary']} />,
  done: () => <Icon name='checkmark' variants={['large', 'primary']} />,
  loading: () =>  <ActivityIndicator  />,
}

export const AppStatusOverlay: React.FC = () => {
  const { status } = useAppSelector((store) => store.AppStatus)

  onUpdate(() => {

    let timeout = null
    if (status === 'done') {
      timeout = setTimeout(() => {
        AppStatus.set('idle')
      }, 2000)
    }
    return () => {
      if (timeout) {
        clearTimeout(timeout)
      }
    }
  }, [status])
 
  const visible = status !== 'idle'


  return (
    <>
      <Overlay visible={visible}  /> 
      <View css={[styles.wrapper, {transform: `scale(${visible ? 1 : 0})`}]}>
        {renderStatus[status]()}
      </View>
    </>
  )
}

// const transition = {
//   duration: 500,
// }


const styles = variantProvider.createComponentStyle({
  wrapper: {
    ...Theme.presets.absolute,
    ...Theme.presets.whole,
    ...Theme.presets.justifyCenter,
    ...Theme.presets.alignCenter,
    pointerEvents: 'none',
    transition: 'transform 0.3s ease',
  },
  icon: {

  },
}, true)
