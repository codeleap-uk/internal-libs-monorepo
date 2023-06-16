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

type AlertProps = ModalProps &
  ComponentVariants<typeof AlertPresets> & {
    body?: string
    children: React.ReactElement
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
    responsiveVariants,
    ...rest
  } = props
  const variantStyles = useDefaultComponentStyle<
    'u:Alert',
    typeof AlertPresets
  >('u:Alert', {
    variants,
    responsiveVariants,
    styles,
  })
  const isRow = orientation === 'row'

  return (
    <Modal centered showClose={false} {...rest}>
      {body ? <Text text={body} css={variantStyles.body} /> : null}
      {children}

      {buttons.length && (
        <View
          variants={[!isRow && 'column', 'marginTop:3']}
          css={variantStyles.buttons}
        >
          {buttons.map((button) => (
            <Button {...button} key={button.text} css={variantStyles.button} />
          ))}
        </View>
      )}
    </Modal>
  )
}
