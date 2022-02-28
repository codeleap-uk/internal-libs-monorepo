/** @jsx jsx */
import {
  AnyFunction,
  ComponentVariants,
  IconPlaceholder,
  ModalComposition,
  ModalStyles,
  onUpdate,
  useDefaultComponentStyle,
} from '@codeleap/common'
import { jsx } from '@emotion/react'
import { ReactNode, useEffect, useLayoutEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import { v4 } from 'uuid'
import { StylesOf } from '../../types/utility'
import { Button } from '../Button'
import { View } from '../View'
import { Text } from '../Text'
import { Overlay } from '../Overlay'

export * from './styles'

export type ModalProps = {
  visible: boolean
  title?: React.ReactNode
  toggle: AnyFunction
  styles?: StylesOf<ModalComposition>
  accessible?: boolean
  showClose?: boolean
  closable?: boolean
  scroll?: boolean
  footer?: ReactNode
} & ComponentVariants<typeof ModalStyles>

function focusModal(event: FocusEvent, id: string) {
  event.preventDefault()
  const modal = document.getElementById(id)
  if (modal) {
    modal.focus()
  }
}
export const ModalContent: React.FC<ModalProps & { id: string }> = (
  modalProps,
) => {
  const {
    children,
    closable = true,
    visible,
    title = '',
    toggle,
    id,
    responsiveVariants,
    variants,
    styles,
    showClose = true,
    footer,
    ...props
  } = modalProps

  const variantStyles = useDefaultComponentStyle('Modal', {
    responsiveVariants,
    variants,
    styles,
  })

  onUpdate(() => {
    if (visible) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'

    }
  }, [visible])

  function closeOnEscPress(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Escape') {
      toggle()
    }
  }

  useLayoutEffect(() => {
    const modal = document.getElementById(id)
    if (modal) {
      modal.focus()
    }
  }, [id])

  return (
    <View
      aria-hidden={!visible}
      css={variantStyles.wrapper}
      className={visible ? 'visible' : ''}
    >
      <Overlay
        visible={visible}
        onClick={closable ? toggle : () => {}}
        css={variantStyles.overlay}
      />
      <View
        component='section'
        css={{
          ...variantStyles.box,
          // visibility: visible ? 'visible' : 'hidden',
        }}
        className='content'
        onKeyDown={closeOnEscPress}
        tabIndex={0}
        id={id}
        aria-modal={true}
        role='dialog'
        aria-describedby={`${id}-title`}
        aria-label='Close the modal by presing Escape key'
        {...props}
      >
        {(title || showClose) && (
          <View
            component='header'
            className='modal-header header'
            id={`${id}-title`}
            css={variantStyles.header}
          >
            {typeof title === 'string' ? <Text text={title} /> : title}

            {showClose && closable && (
              <Button
                rightIcon={'close' as IconPlaceholder}
                variants={['icon']}
                onPress={toggle}
              />
            )}
          </View>
        )}

        <View css={variantStyles.body}>{children}</View>
        {footer && (
          <View component='footer' css={variantStyles.footer}>
            {footer}
          </View>
        )}
      </View>
    </View>
  )
}

export const Modal: React.FC<ModalProps> = ({ accessible, ...props }) => {
  const modalId = useRef(v4())

  useEffect(() => {
    if (accessible) {
      const currentId = modalId.current
      const appRoot = document.body
      appRoot.addEventListener('focusin', (e) => focusModal(e, currentId))
      return () => appRoot.removeEventListener('focusin', (e) => focusModal(e, currentId))
    }
  }, [])

  useEffect(() => {
    if (accessible) {
      const appRoot = document.body
      appRoot.setAttribute('aria-hidden', `${props.visible}`)
      appRoot.setAttribute('tabindex', `${-1}`)
    }
  }, [props.visible])

  if (accessible) {
    if (props.visible) {
      document.body.style.overflow = 'hidden'
      return ReactDOM.createPortal(
        <ModalContent {...props} id={modalId.current} />,
        document.body,
      )
    } else {
      document.body.style.overflow = 'visible'
      return null
    }
  }

  return <ModalContent {...props} id={modalId.current} />
}
