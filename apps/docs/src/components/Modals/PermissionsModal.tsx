import { React, Button, Icon, Image, Modal, Text, variantProvider, Theme, View } from '@/app'
import { AppPermissions, PermissionName, Permissions, TPermissions, useAppSelector } from '@/redux'
import { onUpdate } from '@codeleap/common'
import { ModalProps } from '@codeleap/web'

const defaultState:TPermissions['modalData'] = {
  permissionId: null,
  description: [],
  imageOrIcon: null,
  title: '',
  learnMore: {
    text: '',
  },
  settingsText: 'Open Settings',
  onButtonPress: 'askForPermission',
}

const requiredPermissions:PermissionName[] = ['camera', 'record_audio']

async function askRequiredPermissions() {

  for (const permissionId of requiredPermissions) {
    const hasOpenedModal = await Permissions.setModalToPermission(permissionId)

    if (hasOpenedModal) {
      break
    }
  }

}

export const PermissionModal:React.FC = () => {

  const {
    permissions,
    appStatus,
  } = useAppSelector(store => ({
    permissions: store.Permissions,
    appStatus: store.AppStatus,
  }))

  const {
    permissionId,
    description,
    imageOrIcon,
    title,
    settingsText,
    onButtonPress,
    ...modalProps
  } = { ...defaultState, ...permissions.modalData }

  const toggle = () => Permissions.setModalToPermission(null)

  onUpdate(() => {
    if (permissionId) {

      const unsubscribe = AppPermissions.onPermissionChange(permissionId, ({ status }) => {

        switch (status) {
          case 'granted':
            toggle()
            break
        }

      })
      return unsubscribe
    } else {
      askRequiredPermissions()
    }
  }, [permissionId])

  onUpdate(() => {
    AppPermissions.update()
  }, [appStatus.currentState])

  const handlePress = () => {
    if (typeof onButtonPress === 'function') {
      onButtonPress()
    } else {
      switch (onButtonPress) {
        case 'askForPermission':
          AppPermissions.get(permissionId, {
            askOnDenied: true,
          })
          break
        case 'openSettings':
          console.log('s')
          break
      }
    }

  }

  if (!appStatus.ready) return null

  return (
    <Modal
      visible={!!permissions.modalData}
      // toggle={toggle}
      title={title}
      debugName={'Permissions modal'}
      // variants={['center']}
      // dismissOnBackdrop={false}
      {...modalProps}
    >
      {
        typeof imageOrIcon === 'string' ?
          <Icon name={imageOrIcon} style={styles.icon}/>
          :
          <Image source={imageOrIcon} style={styles.image}/>
      }
      <View variants={['center', 'marginVertical:1']}>
        {
          description.map((text, idx) => <Text text={text} key={idx} variants={['textCenter', 'marginBottom:1']}/>)
        }
      </View>
      <Button text={settingsText} onPress={handlePress} debugName={settingsText} />
    </Modal>)

}

const styles = variantProvider.createComponentStyle({
  icon: {
    height: 80,
    width: 80,
  },
  image: {
    height: 120,
    width: 120,
  },
}, true)
