/** @jsx jsx */
import { jsx, CSSObject } from '@emotion/react'
import {
  AnyFunction,
  ComponentVariants,
  IconPlaceholder,
  TypeGuards,
  onMount,
  onUpdate,
  useDefaultComponentStyle,
  useNestedStylesByKey,
  StylesOf,
  PropsOf,
  useIsomorphicEffect,
} from '@codeleap/common'

import React, { useId, useRef } from 'react'
import ReactDOM from 'react-dom'
import { v4 } from 'uuid'
import { View } from '../View'
import { Text } from '../Text'
import { Overlay, OverlayProps } from '../Overlay'
import { ModalComposition, ModalPresets } from './styles'
import { ActionIcon, ActionIconProps } from '../ActionIcon'
import { Scroll } from '../Scroll'
import { ComponentCommonProps } from '../../types'
import { Touchable, TouchableProps } from '../Touchable'
import { modalScrollLock, ModalStore } from '../../lib/modal'

export * from './styles'

export type ModalProps =
  {
    visible?: boolean
    children?: React.ReactNode
    title?: React.ReactNode | string
    description?: React.ReactNode | string
    renderModalBody?: (props: ModalBodyProps) => React.ReactElement
    toggle?: AnyFunction
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
    withScrollContainer?: boolean
    scrollLock?: boolean
    backdropProps?: Partial<TouchableProps>
    alterHistory?: boolean
    modalId?: string
    autoIndex?: boolean
  } & ComponentVariants<typeof ModalPresets> & ComponentCommonProps

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
    debugName,
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
          <Text debugName={debugName} text={title} css={variantStyles.title} />
        ) : (
          title
        )}

        {showCloseButton && (
          <ActionIcon
            debugName={debugName}
            icon={closeIconName as IconPlaceholder}
            onPress={onPressClose}
            {...closeButtonProps}
            styles={closeButtonStyles}
          />
        )}
      </View>

      {TypeGuards.isString(description) ? (
        <Text debugName={debugName} text={description} style={variantStyles.description} />
      ) : (
        description
      )}
    </View>
  )
}

const defaultProps: Partial<ModalProps> = {
  title: '',
  closeIconName: 'x' as IconPlaceholder,
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
  withScrollContainer: false,
  scrollLock: false,
  autoIndex: false,
  alterHistory: false,
}

export const ModalContent = (
  modalProps: ModalProps & { id: string },
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
    withScrollContainer,
    debugName,
    backdropProps = {},
    alterHistory,
    id: modalId,
    autoIndex,
    ...props
  } = modalProps

  const index = ModalStore(store => (store.indexes?.[modalId] ?? 0))

  const id = useId()
  const modalRef = useRef(null)
  const variantStyles = useDefaultComponentStyle<'u:Modal', typeof ModalPresets>('u:Modal', {
    responsiveVariants,
    variants,
    styles,
  })

  const toggleAndReturn = () => {
    toggle?.()

    if (alterHistory) {
      window.history.back()
    }

    if (TypeGuards.isFunction(onClose)) onClose()
  }

  function closeOnEscPress(e: React.KeyboardEvent<HTMLDivElement>) {
    if (!closeOnEscape) return null

    if (e?.key === 'Escape' || e?.keyCode === 27) {
      toggleAndReturn()
    }
  }

  const handleTabKeyPress = (e: React.KeyboardEvent<HTMLDivElement>, { firstElement, lastElement }: Record<'firstElement' |'lastElement', HTMLDivElement>) => {
    if (e.key === 'Tab' || e?.keyCode === 9) {
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault()
        lastElement.focus()
      } else if (
        !e.shiftKey &&
        document.activeElement === lastElement
      ) {
        e.preventDefault()
        firstElement.focus()
      }
    }
  }

  onUpdate(() => {
    if (visible) {
      const modalElement = modalRef.current

      const focusableElements = modalElement.querySelectorAll('[tabindex]:not([tabindex="-1"])') as NodeListOf<HTMLDivElement>
      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      modalElement.addEventListener('keydown', (e) => handleTabKeyPress(e, { firstElement, lastElement }))
      modalElement.addEventListener('keydown', closeOnEscPress)

      return () => {
        modalElement.removeEventListener('keydown', (e) => handleTabKeyPress(e, { firstElement, lastElement }))
        modalElement.removeEventListener('keydown', closeOnEscPress)
      }
    }
  }, [visible])

  useIsomorphicEffect(() => {
    const modal = document.getElementById(id)
    if (modal) modal.focus()
  }, [id])

  const close = (closable && dismissOnBackdrop) ? toggleAndReturn : () => { }

  const ModalBody = renderModalBody || (scroll ? Scroll : View)

  const ModalArea = withScrollContainer ? Scroll : View

  const _zIndex = React.useMemo(() => {
    return TypeGuards.isNumber(zIndex) ? { zIndex } : {}
  }, [zIndex])

  return (
    <View
      ref={modalRef}
      aria-hidden={!visible}
      css={[
        variantStyles.wrapper,
        visible
          ? variantStyles['wrapper:visible']
          : variantStyles['wrapper:hidden'],
        autoIndex ? { zIndex: index } : {},
        _zIndex,
      ]}
    >
      <Overlay
        debugName={debugName}
        visible={withOverlay ? visible : false}
        css={[
          variantStyles.backdrop,
          visible
            ? variantStyles['backdrop:visible']
            : variantStyles['backdrop:hidden'],
        ]}
        {...overlayProps}
      />

      <ModalArea css={variantStyles.innerWrapper}>
        <Touchable
          css={variantStyles.backdropPressable}
          onPress={close}
          debounce={1000}
          {...backdropProps}
        />
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
            debugName={debugName}
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
      </ModalArea>
    </View>
  )
}

export const Modal = (props) => {
  const allProps = {
    ...Modal.defaultProps,
    ...props,
  }

  const {
    accessible,
    visible: _visible,
    scrollLock,
    modalId: _modalId,
    autoIndex,
    toggle: _toggle,
  } = allProps

  const modalId = useRef(_modalId ?? v4())
  const setIndex = ModalStore(store => store.setIndex)

  const visible = TypeGuards.isBoolean(_visible) ? _visible : ModalStore(store => (store.modals?.[_modalId] ?? false))
  const toggle = TypeGuards.isFunction(_toggle) ? _toggle : ModalStore(store => () => store.toggle(_modalId))

  onMount(() => {
    if (accessible) {
      const appRoot = document.body
      appRoot.addEventListener('focusin', (e) => focusModal(e, modalId.current))
      return () => appRoot.removeEventListener('focusin', (e) => focusModal(e, modalId.current))
    }
  })

  onUpdate(() => {
    if (accessible) {
      const appRoot = document.body
      appRoot.setAttribute('aria-hidden', `${visible}`)
      appRoot.setAttribute('tabindex', `${-1}`)
    }

    if (scrollLock) modalScrollLock(visible, modalId.current)
    
    if (autoIndex) {
      setTimeout(() => {
        setIndex(visible, modalId.current)
      }, visible ? 0 : 500)
    }
  }, [visible])

  const content = <ModalContent {...props} visible={visible} toggle={toggle} id={modalId.current} />

  // if (renderStatus === 'unmounted') return null

  if (typeof window === 'undefined') return content

  return ReactDOM.createPortal(
    content,
    document.body,
  )

}

Modal.defaultProps = defaultProps
