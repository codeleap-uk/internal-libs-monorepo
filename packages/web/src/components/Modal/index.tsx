import { TypeGuards } from '@codeleap/types'
import { onMount, onUpdate } from '@codeleap/hooks'
import React, { useCallback, useId, useRef } from 'react'
import ReactDOM from 'react-dom'
import { v4 } from 'uuid'
import { View } from '../View'
import { Text } from '../Text'
import { Overlay } from '../Overlay'
import { ActionIcon } from '../ActionIcon'
import { Touchable } from '../Touchable'
import { modalScrollLock, modalInferIndexes, modalsState } from '../../lib/tools/modal'
import { ModalHeaderProps, ModalProps } from './types'
import { useStylesFor } from '../../lib/hooks/useStylesFor'
import { WebStyleRegistry } from '../../lib/WebStyleRegistry'
import { AnyRecord, AppIcon, IJSX, StyledComponentProps, useNestedStylesByKey } from '@codeleap/styles'
import { useIsomorphicEffect } from '../../lib'

export * from './styles'
export * from './types'

function focusModal(event: FocusEvent, id: string) {
  event?.preventDefault()
  const modal = document.getElementById(id)
  if (modal) modal.focus()
}

const ModalDefaultHeader = (props: ModalHeaderProps) => {
  const {
    id,
    styles,
    title,
    showClose,
    closable,
    closeIconName,
    onPressClose,
    closeButtonProps = {},
    description,
    debugName,
  } = props

  const closeButtonStyles = useNestedStylesByKey('closeButton', styles)

  const showCloseButton = showClose && closable

  const hasHeader = !!title || !!description || showCloseButton

  if (!hasHeader) return null

  return (
    <View
      id={`${id}-header`}
      component='header'
      style={styles.header}
      className='modal-header header'
    >
      <View id={`${id}-title`} style={styles.titleWrapper}>
        {TypeGuards.isString(title) ? (
          <Text debugName={debugName} text={title} style={styles.title} />
        ) : title}

        {showCloseButton ? (
          <ActionIcon
            debugName={debugName}
            icon={closeIconName as AppIcon}
            onPress={onPressClose}
            {...closeButtonProps}
            style={closeButtonStyles}
          />
        ) : null}
      </View>

      {TypeGuards.isString(description) ? (
        <Text debugName={debugName} text={description} style={styles.description} />
      ) : description}
    </View>
  )
}

const ModalWrapper = ({ styles, visible, modalId, autoIndex, children, closeOnEscPress }) => {
  const index = modalsState.use(state => state.indexes?.[modalId] ?? 0)

  const modalRef = useRef(null)

  const handleTabKeyPress = useCallback((e: React.KeyboardEvent<HTMLDivElement>, { firstElement, lastElement }: Record<'firstElement' | 'lastElement', HTMLDivElement>) => {
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
  }, [])

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

  return <View
    ref={modalRef}
    aria-hidden={!visible}
    style={[
      styles.wrapper,
      visible ? styles['wrapper:visible'] : styles['wrapper:hidden'],
      autoIndex ? { zIndex: index } : null,
    ]}
  >
    {children}
  </View>
}

const ModalContent = (modalProps: ModalProps & { id: string }) => {
  const {
    children,
    visible,
    title,
    toggle,
    footer,
    style,
    renderHeader: ModalHeader,
    closable,
    withOverlay,
    showClose,
    closeIconName,
    renderModalBody: ModalBody,
    closeOnEscape,
    onClose,
    overlayProps,
    dismissOnBackdrop,
    debugName,
    backdropProps,
    alterHistory,
    id: modalId,
    autoIndex,
    ...props
  } = modalProps

  const styles = useStylesFor(Modal.styleRegistryName, style)

  const id = useId()

  const toggleAndReturn = () => {
    toggle?.()

    if (alterHistory) {
      window.history.back()
    }

    if (TypeGuards.isFunction(onClose)) onClose()
  }

  const closeOnEscPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!closeOnEscape) return null

    if (e?.key === 'Escape' || e?.keyCode === 27) {
      toggleAndReturn()
    }
  }

  const close = (closable && dismissOnBackdrop) ? toggleAndReturn : () => null

  useIsomorphicEffect(() => {
    const modal = document.getElementById(id)
    if (modal) modal.focus()
  }, [id])

  return (
    <ModalWrapper
      styles={styles}
      modalId={modalId}
      autoIndex={autoIndex}
      visible={visible}
      closeOnEscPress={closeOnEscPress}
    >
      <Overlay
        debugName={debugName}
        visible={withOverlay ? visible : false}
        {...overlayProps}
        style={[
          styles.backdrop,
          visible ? styles['backdrop:visible'] : styles['backdrop:hidden'],
        ]}
      />

      <View style={styles.innerWrapper}>
        <Touchable
          onPress={close}
          debounce={1000}
          debugName='modal backdrop'
          {...backdropProps}
          style={styles.backdropPressable}
        />

        <View
          component='section'
          className='content'
          tabIndex={0}
          id={id}
          aria-modal={true}
          role='dialog'
          aria-describedby={`${id}-title`}
          aria-label='Close the modal by pressing Escape key'
          {...props}
          style={[
            styles.box,
            visible ? styles['box:visible'] : styles['box:hidden'],
          ]}
        >
          <ModalHeader
            {...modalProps}
            styles={styles}
            id={id}
            onPressClose={toggleAndReturn}
            debugName={debugName}
          />

          <ModalBody style={styles.body} id={id}>
            {children}
          </ModalBody>

          {footer ? (
            <View component='footer' style={styles.footer}>
              {footer}
            </View>
          ) : null}
        </View>
      </View>
    </ModalWrapper>
  )
}

export const Modal = (props: ModalProps) => {
  const allProps = {
    ...Modal.defaultProps,
    ...props,
  }

  const {
    accessible,
    visible,
    scrollLock,
    modalId: _modalId,
    autoIndex,
    toggle,
  } = allProps

  const modalId = useRef(_modalId ?? v4())

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
        modalInferIndexes(visible, modalId.current)
      }, visible ? 0 : 500)
    }

    return () => {
      if (scrollLock) modalScrollLock(false, modalId.current)
    }
  }, [visible])

  const content = <ModalContent {...allProps} visible={visible} toggle={toggle} id={modalId.current} />

  if (typeof window === 'undefined') return content

  return ReactDOM.createPortal(
    content,
    document.body,
  )
}

Modal.styleRegistryName = 'Modal'

Modal.elements = [
  'wrapper',
  'box',
  'backdrop',
  'body',
  'footer',
  'header',
  'title',
  'innerWrapper',
  'backdropPressable',
  'description',
  'titleWrapper',
  `closeButton`,
]

Modal.rootElement = 'wrapper'

Modal.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return Modal as (props: StyledComponentProps<ModalProps, typeof styles>) => IJSX
}

Modal.defaultProps = {
  title: '',
  closeIconName: 'x' as AppIcon,
  closable: true,
  withOverlay: true,
  showClose: true,
  closeOnEscape: true,
  renderHeader: ModalDefaultHeader,
  renderModalBody: View,
  dismissOnBackdrop: true,
  description: null,
  scrollLock: false,
  autoIndex: false,
  alterHistory: false,
} as Partial<ModalProps>

WebStyleRegistry.registerComponent(Modal)
