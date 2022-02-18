import { React,  Modal, Icon, Text, Button } from '@/app'
import { useAppSelector } from '@/redux'
import { onUpdate, useBooleanToggle } from '@codeleap/common'

const text = {
  online: 'Great, you\'re back online.',
  offline: 'Your device is currently offline. Please connect to the internet to continue using the app.',
}

export const NetworkStatusModal:React.FC = () => {
  const {network} = useAppSelector(store => ({
    network: store.AppStatus.network,
  }))

  const [showUntilDissmiss, toggleShowUntilDismiss] = useBooleanToggle(false)

  onUpdate(() => {
    if (network){
      if (!network.isValid && !showUntilDissmiss){
        toggleShowUntilDismiss()
      }

    }
  }, [network])

  if (!network) return null

  const modalToRender =  network.isValid ? 'online' : 'offline'

  const onDismiss = () => toggleShowUntilDismiss()

  return <>
    <Modal 
      visible={modalToRender === 'offline' && showUntilDissmiss} 
      toggle={onDismiss}
      dismissOnBackdrop={false}
      showClose={false}
      variants={['alignCenter']}
      title={'No network connection'}
    >
      <Icon name='network-off' variants={['primary', 'large', 'marginVertical:3']}/>

      <Text text={text.offline} />
    </Modal>
    <Modal 
      visible={modalToRender === 'online' && showUntilDissmiss} 
      toggle={onDismiss}
      variants={['alignCenter']}
      title={'Connection Restored'}
    >
      <Icon name='network-on' variants={['primary', 'large', 'marginVertical:3']}/>

      <Text text={text.online} />

      <Button text={'Dismiss'} onPress={onDismiss} variants={['marginTop:3']}/>
    </Modal>
   
  </>
}

