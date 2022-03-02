import { Modal, variantProvider, View } from '@/app'
import { ModalProps } from '@codeleap/web'
import { capitalize, onUpdate, useToggle } from '@codeleap/common'
import { LoginForm } from './Login'
import { SignupForm } from './Signup'
import { AppStatus, useAppSelector } from '@/redux'

type AuthModalProps = {}

export const AuthModal:React.FC<AuthModalProps> = (props) => {
  const {
    ...modalProps
  } = props

  const [currentForm, toggleForm] = useToggle(['login', 'signup'], 'login')

  function getFormWrapperStyle(form) {
    const isCurrent = currentForm === form
    if (isCurrent) {
      return {
        opacity: 1,
        visibility: 'visible',
        transitionDelay: '0.2s',
      }
    }
    return {
      opacity: 0,
      visibility: 'hidden',
    }
  }

  const isOpen = useAppSelector(store => store.AppStatus.modals.auth)

  return <Modal
    title={capitalize(currentForm)}
    visible={isOpen}
    toggle={() => AppStatus.setModal('auth')}
    variants={['roundish']}
    styles={modalStyles}
    scroll={false}
    {...modalProps}
  >

    <View css={[styles.formWrapper, getFormWrapperStyle('login')]}>
      <LoginForm onFormSwitch={() => toggleForm()} onAuthSuccess={() => AppStatus.setModal('auth')}/>

    </View>
    <View css={[styles.formWrapper, getFormWrapperStyle('signup')]}>
      <SignupForm onFormSwitch={() => toggleForm()} onAuthSuccess={() => AppStatus.setModal('auth')}/>

    </View>

  </Modal>
}

const modalStyles = variantProvider.createComponentStyle<ModalProps['styles']>((theme) => ({
  box: {
    height: '94vh',
    overflow: 'hidden',
    width: '80vw',

    maxWidth: '600px',
  },
  body: {
    alignItems: 'center',
    position: 'relative',
  },
}), true)

const styles = variantProvider.createComponentStyle((theme) => ({
  formWrapper: {
    // ...theme.presets.flex,
    ...theme.presets.column,
    transition: 'opacity 0.2s ease',
    position: 'absolute',
    ...theme.presets.whole,
    ...theme.presets.justifyCenter,
    ...theme.spacing.paddingHorizontal(10),
    ...theme.spacing.paddingVertical(1),
    ...theme.spacing.gap(1.5),
  },
}), true)
