import {
  ComponentVariants,
  StylesOf,
  useDefaultComponentStyle,
} from '@codeleap/common'
import { Button, ButtonProps } from '../Button'
import { Modal, ModalProps } from '../Modal'
import { Text } from '../Text'
import { AlertComposition, AlertPresets } from './styles'
import { View } from '../View'

type Orientation = 'row' | 'column'

type AlertProps = ModalProps & {
  body?: string
  children: React.ReactElement
  variants?: ComponentVariants<typeof AlertPresets>['variants']
  styles?: StylesOf<AlertComposition>
  orientation: Orientation
  buttons?: ButtonProps[]
}

export const Alert = (props: AlertProps) => {
  const {
    body,
    children,
    variants,
    styles,
    buttons = [],
    orientation = 'row',
    ...modalProps
  } = props
  const variantStyles = useDefaultComponentStyle<
    'u:Alert',
    typeof AlertPresets
  >('u:Alert', {
    variants,
    styles,
  })
  const isRow = orientation === 'row'

  return (
    <Modal centered showClose={false} {...modalProps}>
      {body ? <Text text={body} variants={['p1', 'textCenter']} /> : null}
      {children}

      {buttons.length && (
        <View
          variants={[!isRow && 'column', 'marginTop:3']}
          style={variantStyles.buttons}
        >
          {buttons.map((button) => {
            const { variants = [] } = button

            return (
              <Button
                {...button}
                key={button.text}
                variants={['flex', 'fullWidth', ...variants]}
              />
            )
          })}
        </View>
      )}
    </Modal>
  )
}
