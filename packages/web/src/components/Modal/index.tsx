import {
  AnyFunction,
  ComponentVariants,
  IconPlaceholder,
  TypeGuards,
  onMount,
  onUpdate,
  useDefaultComponentStyle,
  useNestedStylesByKey,
  useUnmount,
} from '@codeleap/common'

import React, { useId, useLayoutEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import { v4 } from 'uuid'

import { View } from '../View'
import { Text } from '../Text'
import { Overlay } from '../Overlay'
import { StylesOf } from '../../types/utility'
import { ModalComposition, ModalPresets } from './styles'
import { ActionIcon } from '../ActionIcon'
import { Scroll } from '../Scroll'

export * from './styles'

export type ModalProps = React.PropsWithChildren<
  {
    visible: boolean
    title?: React.ReactNode
    description?: React.ReactElement
    renderModalBody?: () => React.ReactElement
    toggle: AnyFunction
    styles?: StylesOf<ModalComposition>
    accessible?: boolean
    showClose?: boolean
    closable?: boolean
    scroll?: boolean
    header?: React.ReactElement
    footer?: React.ReactNode
    withOverlay?: boolean
    closeIconName?: IconPlaceholder
    keepMounted?: boolean
    renderHeader?: (props: ModalHeaderProps) => React.ReactElement
    debugName?: string
  } & ComponentVariants<typeof ModalPresets>
>

export type ModalHeaderProps = {}

function focusModal(event: FocusEvent, id: string) {
  event.preventDefault()
  const modal = document.getElementById(id)
  if (modal) modal.focus()
}

export const ModalContent: React.FC<ModalProps & { id: string }> = (
  modalProps,
) => {
  const {
    children,
    visible,
    title = '',
    toggle,
    variants = [],
    styles,
    footer,
    renderHeader,
    closable,
    withOverlay,
    showClose,
    responsiveVariants,
    closeIconName,
    renderModalBody,
    ...props
  } = {
    ...Modal.defaultProps,
    ...modalProps,
  }

  const id = useId()

  const variantStyles = useDefaultComponentStyle<
    'u:Modal',
    typeof ModalPresets
  >('u:Modal', {
    responsiveVariants,
    variants: [...variants],
    styles,
  })

  const toggleAndReturn = () => {
    toggle?.()
    window.history.back()
  }

  onUpdate(() => {
    if (visible) {
      document.body.style.overflow = 'hidden'
      window.history.pushState(null, null, window.location.pathname)
      window.addEventListener('popstate', toggle)
    } else {
      document.body.style.overflow = 'auto'
      window.removeEventListener('popstate', toggle)
    }
  }, [visible])

  useUnmount(() => {
    window.removeEventListener('popstate', toggle)
  })

  function closeOnEscPress(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Escape') {
      toggleAndReturn()
    }
  }

  useLayoutEffect(() => {
    const modal = document.getElementById(id)
    if (modal) modal.focus()
  }, [id])

  const ModalDefaultHeader = () => (
    <View
      id={`${id}-title`}
      component='header'
      css={variantStyles.header}
      className='modal-header header'
    >
      {TypeGuards.isString(title) ? (
        <Text text={title} css={variantStyles.title} />
      ) : (
        title
      )}

      {showClose && closable && (
        <ActionIcon
          icon={closeIconName as IconPlaceholder}
          onPress={toggleAndReturn}
          styles={closeButtonStyles}
        />
      )}
    </View>
  )

  const ModalHeader = renderHeader || ModalDefaultHeader

  const closeButtonStyles = useNestedStylesByKey('closeButton', variantStyles)

  const close = closable ? toggleAndReturn : () => {}

  const hasHeader = title || (closable && showClose)

  const ModalBody = renderModalBody || (scroll ? Scroll : View)

  return (
    <View
      aria-hidden={!visible}
      css={[
        variantStyles.wrapper,
        visible
          ? variantStyles['wrapper:visible']
          : variantStyles['wrapper:hidden'],
      ]}
    >
      <Overlay
        visible={withOverlay ? visible : false}
        css={[
          variantStyles.backdrop,
          visible
            ? variantStyles['backdrop:visible']
            : variantStyles['backdrop:hidden'],
        ]}
      />

      <View css={variantStyles.innerWrapper}>
        <View css={variantStyles.backdropPressable} onClick={close} />
        <View
          component='section'
          css={[
            variantStyles.box,
            visible
              ? variantStyles['box:visible']
              : variantStyles['box:hidden'],
          ]}
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
          {hasHeader && <ModalHeader />}

          <ModalBody css={variantStyles.body}>{children}</ModalBody>
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

export const Modal: React.FC<ModalProps> = ({
  accessible,
  keepMounted = true,
  ...props
}) => {
  const modalId = useRef(v4())
  const [renderStatus, setRenderStatus] = React.useState(
    keepMounted ? 'mounted' : 'unmounted',
  )

  onUpdate(() => {
    if (!keepMounted) {
      if (props.visible) {
        setRenderStatus('mounted')
      } else {
        setTimeout(() => setRenderStatus('unmounted'), 500)
      }
    }
  }, [keepMounted, props.visible])

  onMount(() => {
    if (accessible) {
      const currentId = modalId.current
      const appRoot = document.body
      appRoot.addEventListener('focusin', (e) => focusModal(e, currentId))
      return () => appRoot.removeEventListener('focusin', (e) => focusModal(e, currentId))
    }
  })

  onUpdate(() => {
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

  if (renderStatus === 'unmounted') return null

  return <ModalContent {...props} id={modalId.current} />
}

Modal.defaultProps = {
  closeIconName: 'close' as IconPlaceholder,
  closable: true,
  withOverlay: true,
  showClose: true,
  scroll: true,
}
