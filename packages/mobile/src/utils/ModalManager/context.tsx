import * as React from 'react'
import { AnyFunction, useCodeleapContext, useState } from '@codeleap/common'
import { PortalProvider } from '@gorhom/portal'

export type AppModalProps = {
  visible: boolean
  attachments: string[]
  attachedTo: string[]
}
type TModalState = AppModalProps
type ModalTransitionOptions = {
  duration?: number
}

type TModalContext = {
    state: Record<string, TModalState>
    toggleModal: (name: string, setTo?: boolean) => void
    setModal: (name: string, to: Partial<TModalState>) => void
    currentModal: string
  isVisible: (name: string) => boolean
  transition: (from: string, to: string, options?: ModalTransitionOptions) => Promise<void>
 attach: (modal: string, to: string) => void
}

const ModalContext = React.createContext({} as TModalContext)

export function Provider({ children }) {
  const [modals, setModals] = useState<TModalContext['state']>({})
  const currentModal = Object.keys(modals).find(name => modals[name].visible)

  function isVisible(name: string) {
    return !!modals[name]?.visible
  }

  const toggleModal:TModalContext['toggleModal'] = (name, set?: boolean) => {
    const visible = isVisible(name)

    const newVisible = typeof set === 'boolean' ? set : !visible

    setModals((current) => {
      const attached = newVisible ? [] : current[name].attachments.map(m => [m, { ...current[m], visible: false }])
      return {
        ...current,
        [name]: {
          ...current[name],
          visible: newVisible,
        },
        ...Object.fromEntries(attached),
      }

    })
  }

  const setModal:TModalContext['setModal'] = (name, to) => {

    setModals((current) => ({
      ...current,
      [name]: {
        ...current[name],
        ...to,
      },
    }))

  }

  const codeleapCtx = useCodeleapContext()

  const transition:TModalContext['transition'] = (from, to, options) => {
    const _options:ModalTransitionOptions = {
      duration: codeleapCtx?.Theme?.values?.modalTransitionDuration || 300,
      ...options,
    }

    const toVisible = isVisible(to)
    const fromVisible = isVisible(from)
    if (toVisible) return
    if (!fromVisible && !toVisible) {
      toggleModal(to)
      return
    }

    toggleModal(from)
    return new Promise((resolve) => {
      setTimeout(() => {
        if (to) {
          toggleModal(to)
        }
        resolve()
      }, _options.duration)

    })
  }

  function attach(modal: string, to: string) {
    setModals((modals) => {
      const toModal = modals[to]
      const _modal = modals[modal]
      if (!toModal || !_modal) return modals

      const isAttached = toModal.attachments.includes(modal) || _modal.attachedTo.includes(to)

      const newVal = { ...modals }
      if (isAttached) {

        newVal[to].attachments = newVal[to].attachments.filter(x => x !== modal)
        newVal[modal].attachedTo = newVal[modal].attachedTo.filter(x => x !== to)

      } else {

        newVal[to].attachments.push(modal)
        newVal[modal].attachedTo.push(to)

      }
      return newVal
    })
  }

  return <ModalContext.Provider value={{
    state: modals,
    toggleModal,
    setModal,
    currentModal,
    attach,
    isVisible,
    transition,

  }}>
    <PortalProvider>

      {children}
    </PortalProvider>
  </ModalContext.Provider>
}

export function useModalContext() {
  const context = React.useContext(ModalContext)
  return context
}

export type UseModalSequenceOptions = {
  onFinish?: AnyFunction
  resetOnFinish?: boolean
  closeLastOnFinish?: boolean
  waitForLastToCloseBeforeCallingFinish?: boolean
  transitionOpts?: Partial<Parameters<TModalContext['transition']>[2]>
}

export function useModalSequence(ids: string[], options?: UseModalSequenceOptions) {

  const _options:UseModalSequenceOptions = {
    closeLastOnFinish: true,
    onFinish: () => {},
    resetOnFinish: false,
    waitForLastToCloseBeforeCallingFinish: true,
    ...options,
  }

  const modals = useModalContext()
  const [idx, setIdx] = useState(0)

  const state = {
    currentId: ids[idx],
    nextId: ids[idx + 1],
    previousId: ids[idx - 1],
  }
  function next() {
    if (idx === ids.length - 1) {
      if (_options.closeLastOnFinish) {
        modals.transition(ids[idx], null).then(() => {
          if (_options.waitForLastToCloseBeforeCallingFinish) {
            _options.onFinish()
          }
        })
      }
      if (_options.resetOnFinish) {
        reset()
      }
      if (!(_options.waitForLastToCloseBeforeCallingFinish && _options.closeLastOnFinish)) {
        _options.onFinish()
      }
      return
    } else {
      if (!state.nextId) return
      modals.transition(ids[idx], ids[idx + 1])
      setIdx(i => i + 1)
    }
  }
  function previous() {
    if (!state.previousId) return
    modals.transition(ids[idx], ids[idx - 1])
    setIdx(i => i - 1)

  }
  function reset() {
    setIdx(0)
  }

  return {
    reset,
    next,
    previous,
    setModal: setIdx,
    currentIdx: idx,
    ...state,

  }

}
