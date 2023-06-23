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
  StylesOf,
  PropsOf,
} from '@codeleap/common'

import React, { useId, useLayoutEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import { v4 } from 'uuid'
import { View } from '../View'
import { Text } from '../Text'
import { Overlay, OverlayProps } from '../Overlay'
import { ModalComposition, ModalPresets } from './styles'
import { ActionIcon, ActionIconProps } from '../ActionIcon'
import { Scroll } from '../Scroll'

export * from './styles'

export type ModalProps =
  {
    visible: boolean
    children?: React.ReactNode
    title?: React.ReactNode | string
    description?: React.ReactNode | string
    renderModalBody?: (props: ModalBodyProps) => React.ReactElement
    toggle: AnyFunction
    styles?: StylesOf<ModalComposition>
    style?: React.CSSProperties
    accessible?: boolean
    showClose?: boolean
    closable?: boolean
    dismissOnBackdrop?: boolean
    scroll?: boolean
    header?: React.ReactElement
    footer?: React.ReactNode
    withOverlay?: boolean
    closeIconName?: IconPlaceholder
    keepMounted?: boolean
    renderHeader?: (props: ModalHeaderProps) => React.ReactElement
    debugName?: string
    closeButtonProps?: Partial<ActionIconProps>
    closeOnEscape?: boolean
    onClose?: () => void
    overlayProps?: Partial<OverlayProps>
    zIndex?: number
    scrollable?: boolean
  } & ComponentVariants<typeof ModalPresets>

function focusModal(event: FocusEvent, id: string) {
  event.preventDefault()
  const modal = document.getElementById(id)
  if (modal) modal.focus()
}

type ModalBodyProps = {
  id: string
  variantStyles: PropsOf<ModalComposition>
}

type ModalHeaderProps = Partial<Omit<ModalProps, 'children'>> & {
  id: string
  variantStyles: PropsOf<ModalComposition>
  onPressClose: () => void
}

const ModalDefaultHeader = (props: ModalHeaderProps) => {
  const {
    id,
    variantStyles,
    title,
    showClose,
    closable,
    closeIconName,
    onPressClose,
    closeButtonProps = {},
    description,
  } = props

  const closeButtonStyles = useNestedStylesByKey('closeButton', variantStyles)

  const showCloseButton = showClose && closable

  const hasHeader = !!title || !!description || showCloseButton

  if (!hasHeader) return null

  return (
    <View
      id={`${id}-header`}
      component='header'
      css={variantStyles.header}
      className='modal-header header'
    >
      <View id={`${id}-title`} css={variantStyles.titleWrapper}>
        {TypeGuards.isString(title) ? (
          <Text text={title} css={variantStyles.title} />
        ) : (
          title
        )}
    
        {showCloseButton && (
          <ActionIcon
            icon={closeIconName as IconPlaceholder}
            onPress={onPressClose}
            {...closeButtonProps}
            styles={closeButtonStyles}
          />
        )}
      </View>

      {TypeGuards.isString(description) ? (
        <Text text={description} style={variantStyles.description} />
      ) : (
        description
      )}
    </View>
  )
}

const defaultProps: Partial<ModalProps> = {
  title: '',
  closeIconName: 'close' as IconPlaceholder,
  closable: true,
  withOverlay: true,
  showClose: true,
  scroll: false,
  closeOnEscape: true,
  renderHeader: ModalDefaultHeader,
  keepMounted: true,
  dismissOnBackdrop: true,
  zIndex: null,
  description: null,
  scrollable: false,
}

export const ModalContent: React.FC<ModalProps & { id: string }> = (
  modalProps,
) => {
  const {
    children,
    visible,
    title,
    toggle,
    variants = [],
    styles,
    footer,
    style = {},
    renderHeader: ModalHeader,
    closable,
    withOverlay,
    showClose,
    responsiveVariants = {},
    closeIconName,
    scroll,
    renderModalBody,
    closeOnEscape,
    onClose,
    overlayProps = {},
    dismissOnBackdrop,
    zIndex,
    scrollable,
    ...props
  } = modalProps

  const id = useId()

  const variantStyles = useDefaultComponentStyle<'u:Modal', typeof ModalPresets>('u:Modal', {
    responsiveVariants,
    variants,
    styles,
  })

  const toggleAndReturn = () => {
    toggle?.()
    window.history.back()

    if (TypeGuards.isFunction(onClose)) onClose()
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
    if (!closeOnEscape) return null

    if (e?.key === 'Escape' || e?.keyCode === 27) {
      toggleAndReturn()
    }
  }

  useLayoutEffect(() => {
    const modal = document.getElementById(id)
    if (modal) modal.focus()
  }, [id])

  const close = (closable && dismissOnBackdrop) ? toggleAndReturn : () => {}

  const ModalBody = renderModalBody || (scroll ? Scroll : View)

  const ModalArea = scrollable ? Scroll : View

  const _zIndex = React.useMemo(() => {
    return TypeGuards.isNumber(zIndex) ? { zIndex } : {}
  }, [zIndex])

  return (
    <ModalArea
      aria-hidden={!visible}
      css={[
        variantStyles.wrapper,
        _zIndex,
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
        {...overlayProps}
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
            style,
          ]}
          className='content'
          onKeyDown={closeOnEscPress}
          tabIndex={0}
          id={id}
          aria-modal={true}
          role='dialog'
          aria-describedby={`${id}-title`}
          aria-label='Close the modal by pressing Escape key'
          {...props}
        >
          <ModalHeader 
            {...modalProps}
            variantStyles={variantStyles}
            id={id}
            onPressClose={toggleAndReturn}
          />

          <ModalBody
            css={variantStyles.body}
            variantStyles={variantStyles}
            id={id}
          >
            {children}
          </ModalBody>

          {footer && (
            <View component='footer' css={variantStyles.footer}>
              {footer}
            </View>
          )}
        </View>
      </View>
    </ModalArea>
  )
}

export const Modal: React.FC<ModalProps> = (props) => {
  const allProps = {
    ...Modal.defaultProps,
    ...props,
  }

  const {
    accessible,
    keepMounted,
    visible,
  } = allProps

  const modalId = useRef(v4())
  const [renderStatus, setRenderStatus] = React.useState(
    keepMounted ? 'mounted' : 'unmounted',
  )

  onUpdate(() => {
    if (!keepMounted) {
      if (visible) {
        setRenderStatus('mounted')
      } else {
        setTimeout(() => setRenderStatus('unmounted'), 500)
      }
    }
  }, [keepMounted, visible])

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
      appRoot.setAttribute('aria-hidden', `${visible}`)
      appRoot.setAttribute('tabindex', `${-1}`)
    }
  }, [visible])

  if (accessible) {
    if (visible) {
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

Modal.defaultProps = defaultProps
