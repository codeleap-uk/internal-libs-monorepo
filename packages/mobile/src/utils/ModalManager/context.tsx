import * as React from 'react'
import { AnyFunction, onUpdate, TypeGuards, useCodeleapContext, useState } from '@codeleap/common'
import { PortalProvider } from '@gorhom/portal'
import { KeyboardProvider } from '../KeyboardAware'

export type AppModalProps = {
  visible: boolean
  attachments: string[]
  attachedTo: string[]
  props?: any
}
type TModalState = AppModalProps
type ModalTransitionOptions = {
  duration?: number
  props?: any
}

type TModalContext = {
  state: Record<string, TModalState>
  toggleModal: (name: string, setTo?: boolean, props?: any) => void
  setModal: (name: string, to: Partial<TModalState>) => void
  currentModal: string
  isVisible: (name: string) => boolean
  transition: (from: string, to: string, options?: ModalTransitionOptions) => Promise<void>
  attach: (modal: string, to: string) => void
  remove(name: string): void
  transitionDuration: number
}

const ModalContext = React.createContext({} as TModalContext)

export function Provider({ children }) {
  const [modals, setModals] = useState<TModalContext['state']>({})
  const currentModal = Object.keys(modals).find(name => modals[name].visible)

  function isVisible(name: string) {
    return !!modals[name]?.visible
  }

  const toggleModal:TModalContext['toggleModal'] = (name, set?: boolean, props?: any) => {
    const visible = isVisible(name)

    const newVisible = typeof set === 'boolean' ? set : !visible

    setModals((current) => {
      const attached = newVisible ? [] : current[name].attachments.map(m => [m, { ...current[m], visible: false }])
      return {
        ...current,
        [name]: {
          ...current[name],
          visible: newVisible,
          props,
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
  const defaultDuration = codeleapCtx?.Theme?.values?.transitions?.modal?.duration || 300
  const transition:TModalContext['transition'] = (from, to, options) => {
    return new Promise((resolve) => {
      setTimeout(() => {

        if (!from) {
          toggleModal(to, true, options?.props)
          return
        }
        const _options:ModalTransitionOptions = {
          duration: defaultDuration,
          ...options,
        }

        const toVisible = isVisible(to)
        const fromVisible = isVisible(from)

        // if (!fromVisible && !toVisible) {
        //   toggleModal(to, true, options?.props)
        //   return
        // }

        toggleModal(from, false)
        setTimeout(() => {

          toggleModal(to, true, options?.props)

          resolve()
        }, _options.duration)

      })
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

  function remove(id: string) {
    const newModals = { ...modals }

    delete newModals[id]

    setModals(newModals)
  }

  return <KeyboardProvider>
    <ModalContext.Provider value={{
      state: modals,
      toggleModal,
      setModal,
      currentModal,
      attach,
      isVisible,
      remove,
      transition,
      transitionDuration: defaultDuration,

    }}>
      <PortalProvider>

        {children}
      </PortalProvider>
    </ModalContext.Provider>
  </KeyboardProvider>

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
  autoOpen?: boolean
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

  onUpdate(() => {
    if (_options.autoOpen && typeof ids?.[0] === 'number') {
      if (!modals.isVisible(ids[0])) {
        modals.toggleModal(ids[0])
      }
    }
  }, [_options.autoOpen, ids?.[0]])

  function next(props?: any) {
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
      modals.transition(ids[idx], state.nextId, props)
      setIdx(i => i + 1)
    }
  }
  function previous(props?: any) {
    if (!state.previousId) return

    modals.transition(ids[idx], state.previousId, props)
    setIdx(i => i - 1)

  }

  function goto(idxOrId: string | number, props?: any) {
    let newId:string = null
    if (TypeGuards.isString(idxOrId)) {
      newId = idxOrId

    } else {
      newId = ids[idxOrId]
    }
    modals.transition(ids[idx], newId, {
      props,
    })
    setIdx(ids.indexOf(newId))
  }
  function reset() {
    setIdx(0)
  }

  return {
    reset,
    next,
    previous,
    setModal: setIdx,
    goto,
    currentIdx: idx,
    ...state,

  }

}
