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
    withScrollContainer?: boolean
    scrollLocked?: boolean
    backdropProps?: Partial<TouchableProps>
    alterHistory?: boolean
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
  scrollLocked: true,
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
    scrollLocked,
    backdropProps = {},
    alterHistory = false,
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
        debugName={debugName}
        visible={withOverlay ? visible : false}
        css={[
          variantStyles.backdrop,
          visible
            ? variantStyles['backdrop:visible']
            : variantStyles['backdrop:hidden'],
        ]}
        scrollLocked={scrollLocked}
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
    keepMounted,
    visible,
  } = allProps

  const modalId = useRef(v4())

  onMount(() => {
    if (accessible) {
      const currentId = modalId
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

    if (visible) {
      document.body.style.overflowY = 'hidden'
      document.body.style.overflowX = 'hidden'
      document.body.style.maxHeight = '100svh'
    } else {
      document.body.style.overflowY = 'visible'
      document.body.style.overflowX = 'hidden'
      document.body.style.maxHeight = 'unset'
    }
  }, [visible])

  const content = <ModalContent {...props} id={modalId.current} />

  // if (renderStatus === 'unmounted') return null

  if (typeof window === 'undefined') return content

  return ReactDOM.createPortal(
    content,
    document.body,
  )

}

Modal.defaultProps = defaultProps

