/** @jsx jsx */
import { jsx } from '@emotion/react'

import {
  AnyFunction,
  ComponentVariants,
  IconPlaceholder,
  onUpdate,
  useDefaultComponentStyle,
  useNestedStylesByKey,
} from '@codeleap/common'

import React, { ReactNode, useEffect, useId, useLayoutEffect, useRef } from 'react'
import ReactDOM from 'react-dom'

import { v4 } from 'uuid'

import { StylesOf } from '../../types/utility'
import { Button } from '../Button'
import { View } from '../View'
import { Text } from '../Text'
import { Overlay } from '../Overlay'

import { ModalComposition, ModalPresets } from './styles'
import { ActionIcon } from '../ActionIcon'

export * from './styles'

export type ModalProps = React.PropsWithChildren<{
  visible: boolean
  title?: React.ReactNode
  description?: React.ReactElement
  toggle: AnyFunction
  styles?: StylesOf<ModalComposition>
  accessible?: boolean
  showClose?: boolean
  closable?: boolean
  scroll?: boolean
  header?: React.ReactElement
  footer?: React.ReactNode
  debugName?: string
} & ComponentVariants<typeof ModalPresets>
>

export type ModalHeaderProps = {

}

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
    responsiveVariants,
    variants,
    styles,
    showClose = true,
    footer,
    ...props
  } = modalProps

  const id = useId()

  const variantStyles = useDefaultComponentStyle<'u:Modal', typeof ModalPresets>('u:Modal', {
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

  const ModalHeader:React.FC<ModalHeaderProps> = (props) => {
    const {
      styles,
      title = null,
      showClose = false,
      description = null,
      closable, debugName,
      closeIconName = 'close',
      toggle,
    } = props
    return (
      <View
        component='header'
        className='modal-header header'
        id={`${id}-title`}
        css={variantStyles.header}
      >
        {typeof title === 'string' ? <Text text={title} css={variantStyles.title} /> : title}

        {showClose && closable && (
          <ActionIcon
            icon={'close' as IconPlaceholder}

            onPress={toggle}
            styles={closeButtonStyles}
          />
        )}
      </View>
    )
  }

  //TO-DO: Change the title or showClose conditional to a default header or a custom header

  const closeButtonStyles = useNestedStylesByKey('closeButton', variantStyles)
  const close = closable ? toggle : () => {}
  return (
    <View
      aria-hidden={!visible}
      css={[variantStyles.wrapper, visible ? variantStyles['wrapper:visible'] : variantStyles['wrapper:hidden']]}
    >
      <Overlay
        visible={visible}

        css={[variantStyles.backdrop, visible ? variantStyles['backdrop:visible'] : variantStyles['backdrop:hidden']]}
      />
      <View css={variantStyles.innerWrapper} >
        <View css={variantStyles.backdropPressable} onClick={close}/>
        <View
          component='section'
          css={[variantStyles.box, visible ? variantStyles['box:visible'] : variantStyles['box:hidden']]}
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
          <ModalHeader />
          {/* {(title || showClose) && (
            <View
              component='header'
              className='modal-header header'
              id={`${id}-title`}
              css={variantStyles.header}
            >
              {typeof title === 'string' ? <Text text={title} css={variantStyles.title} /> : title}

              {showClose && closable && (
                <ActionIcon
                  icon={'close' as IconPlaceholder}

                  onPress={toggle}
                  styles={closeButtonStyles}
                />
              )}
            </View>
          )} */}

          <View css={variantStyles.body}>{children}</View>
          {footer && (
            <View component='footer' css={variantStyles.footer}>
              {footer}
            </View>
          )}
        </View>
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
