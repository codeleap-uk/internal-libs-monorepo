import { Button, React, Text, Modal, variantProvider, Theme, api } from '@/app'
import { AppStatus, Session, useAppSelector } from '@/redux'

export const DebugModal:React.FC = () => {
  const { isDevelopment, isModalOpen } = useAppSelector(store => ({
    isDevelopment: store.Session.isDevelopment,
    isModalOpen: store.AppStatus.modals.debug,
  }))

  if (!__DEV__) return null

  const toggle = () => AppStatus.setModal('debug')

  return <>
    <Modal visible={isModalOpen} toggle={toggle}>
      <Text text={`Using ${isDevelopment ? 'development' : 'production'} server -> ${api.axios.defaults.baseURL}`} />
      <Button text={'Switch server'}
        debugName={`Switch server`} onPress={() => {
          Session.setMode()
        }} />
    </Modal>
    <Button icon='bug' onPress={toggle} debugName={`set AppStatus debug`} styles={toggleButtonStyle} variants={['circle']}/>
  </>
}

const toggleButtonStyle = variantProvider.createComponentStyle({
  wrapper: {
    ...Theme.presets.absolute,
    right: 20,
    bottom: 80,
    ...Theme.sized(4),
  },
  icon: {
    ...Theme.sized(1.8),
    color: Theme.colors.background,
  },
})
