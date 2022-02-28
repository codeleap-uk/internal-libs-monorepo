import { Button, Modal, variantProvider, View } from '@/app'
import { ModalProps } from '@codeleap/web'
import { capitalize, useComponentStyle, useState } from '@codeleap/common'
import { LoginForm } from './Login'
import { SignupForm } from './Signup'
import { Logo } from '../Logo'

type AuthModalProps = ModalProps

const options = [
  'login',
  'signup',
]

export const AuthModal:React.FC<AuthModalProps> = (props) => {
  const {

    ...modalProps
  } = props

  const [currentForm, setForm] = useState('login')
  const styles = useComponentStyle(componentStyles)

  return <Modal {...modalProps} variants={['roundish']} styles={{ box: styles.modalBox }} scroll={false}>
    <View variants={['row', 'relative', 'sticky']} css={styles.header}>
      {
        options.map((o) => (
          <Button
            text={capitalize(o)}
            onPress={() => setForm(o)}
            variants={['text', 'flex']}
            styles={{ text: o === currentForm ? styles.tabButtonTextSelected : {}}}
          />
        ))
      }
      <View css={{
        ...styles.tabSlider,
        transform: `translateX(${currentForm === 'login' ? '0%' : '100%'})`,
      }}/>
    </View>
    <View variants={['flex', 'column', 'padding:3']}>

      {
        currentForm === 'login' ? <LoginForm /> : <SignupForm />
      }
    </View>
  </Modal>
}

const componentStyles = variantProvider.createComponentStyle((theme) => ({
  tabSlider: {
    backgroundColor: theme.colors.primary,
    height: '3px',
    width: '50%',
    transition: 'transform 0.3s ease',
    ...theme.presets.absolute,
    bottom: 0,
  },
  tabButtonTextSelected: {
    color: theme.colors.textH,
  },
  modalBox: {
    height: '94vh',
    overflow: 'hidden',

  },
  logo: {
    width: '50%',
  },
  header: {
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.background,
  },
}))
