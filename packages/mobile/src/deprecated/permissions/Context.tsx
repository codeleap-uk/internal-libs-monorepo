import React, { useContext, useState } from 'react'
import { onMount, onUpdate, useDebounce, usePrevious } from '@codeleap/hooks'
import { deepEqual } from '@codeleap/utils'
import { AppState, Linking } from 'react-native'
import { PermissionConfig, PermissionModalsConfig } from './types'
import { PermissionManager, PermissionTypes } from './package'
import { useModalContext } from '../modals/Context'

type TPermissionContext = {
  state: Record<string, PermissionTypes.PermissionStatus>
  modalConfig: PermissionModalsConfig<any>
  manager: PermissionManager<any, any>
  setState: (forPermission: string, status: PermissionTypes.PermissionState) => void
}

const PermissionContext = React.createContext({} as TPermissionContext)

type PermissionProviderProps = {
  children: React.ReactElement
  AppPermissions: PermissionManager<any, any>
  modalConfig: PermissionModalsConfig<any>
}
type PermissionsRecord = PermissionManager<any, any>['values']
function getStatuses(state: PermissionsRecord) {
  const statuses = Object.entries(state).map(([k, v]) => [k, v.status])
  return Object.fromEntries(statuses)
}

export function Provider({ children, AppPermissions, modalConfig }: PermissionProviderProps) {

  const [state, setState] = useState(() => getStatuses(AppPermissions.values))

  onMount(() => {

    AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        AppPermissions.update().then((vals) => {
          const statuses = getStatuses(vals)
          if (!deepEqual(statuses, state)) {
            setState({ ...statuses })
          }
        })
      }
    })

  })

  const setPermissionState = (forPermission: string, status: PermissionTypes.PermissionState) => {
    setState({
      ...state,
      [forPermission]: status
    })
  }


  return <PermissionContext.Provider value={{
    state,
    modalConfig: modalConfig,
    manager: AppPermissions,
    setState: setPermissionState
  }}>
    {children}
  </PermissionContext.Provider>
}

type TAskManyResults<T extends string> = Record<T, PermissionTypes.PermissionStatus> & {
  overall
  : PermissionTypes.PermissionStatus
}

type AskManyOpts<T extends string | number | symbol> = {
  breakOnDenied?: T[]
}

export type UsePermissions<
  _PermissionNames extends string,
  PermissionNames extends string = `${_PermissionNames}?` | _PermissionNames> = () => TPermissionContext & {
    askPermission: (name: PermissionNames, onResolve?: (status: PermissionTypes.PermissionStatus) => any) => Promise<PermissionTypes.PermissionStatus>
    askMany<T extends PermissionNames, R = TAskManyResults<T>>(
      perms: T[],
      onResolve?: (res: R) => any,
      options?: AskManyOpts<T>
    ): Promise<
      R
    >
  }

export const usePermissions: UsePermissions<any> = () => {
  const modalCtx = useModalContext()
  const permissionCtx = useContext(PermissionContext)

  function askPermission(name: string, onResolve?: (status: PermissionTypes.PermissionStatus, modalName?: string) => any) {
    return new Promise<PermissionTypes.PermissionStatus>((resolve, reject) => {
      permissionCtx.manager.get(name, {
        ask: false,
        askOnDenied: false,
        askOnPending: false,
      }).then(status => {
        const permissionModalName = `permissions.${name}`

        if (!status.isGranted) {

          modalCtx.toggleModal(permissionModalName, true, {
            onPermissionResolve: (status) => {
              modalCtx.toggleModal(permissionModalName, false, {})
              setTimeout(() => {
                onResolve?.(status, permissionModalName)

                resolve(status)
              }, modalCtx.transitionDuration)
            },
          })

        } else {
          onResolve?.(status.status as unknown as PermissionTypes.PermissionStatus)
          resolve(status)
        }
      })
    })

  }

  const askMany = async (
    perms: any[],
    onResolve?: (res: any) => any,
    options?: AskManyOpts<any>,
  ) => {

    let prevModal = null
    const results = {}

    for (const _permission of perms) {
      const permission = _permission.replace('?', '')
      const status = await permissionCtx.manager.get(permission, {
        ask: false,
        askOnDenied: false,
        askOnPending: false,
      })
      results[permission] = status.status
      const permissionModalName = `permissions.${permission}`

      if (!status.isGranted) {
        let onOpen = null

        if (prevModal) {

          onOpen = () => new Promise((resolve) => {
            setTimeout(() => {

              modalCtx.transition(prevModal, permissionModalName, {
                props: {
                  onPermissionResolve: (status) => {
                    resolve(status)
                    permissionCtx.setState(permission, status)
                  },
                },
              })
            })
          })
        } else {
          onOpen = () => new Promise((resolve) => {
            setTimeout(() => {
              modalCtx.toggleModal(permissionModalName, true, {
                onPermissionResolve: (status) => {
                  resolve(status)
                  permissionCtx.setState(permission, status)

                },
              })
            })
          })

        }

        results[permission] = await onOpen()
        prevModal = permissionModalName

        if (!_permission.endsWith('?') && results[permission] !== 'granted') {
          break
        }
      }
    }
    if (prevModal) {

      setTimeout(() => {
        modalCtx.toggleModal(prevModal, false, {})
      })
    }
    const res: Parameters<typeof onResolve>[0] = {
      ...results,
      overall: Object.values(results).every(x => x === 'granted') ? 'granted' : 'denied',
    }
    onResolve(res)
    return res
  }

  return {
    askPermission,
    askMany,
    ...permissionCtx,
  }
}

export function usePermissionModal(permissionName: string) {

  const modalId = `permissions.${permissionName}`
  const modals = useModalContext()
  const permissionCtx = usePermissions()
  const modalState = modals.state[modalId]

  const currentState = permissionCtx?.state?.[permissionName]
  const status = currentState
  const [debouncedStatus, reset] = useDebounce(status, modals.transitionDuration * 0.5)

  function getConfig(withStatus) {
    return {
      ...permissionCtx.modalConfig[permissionName],
      ...permissionCtx.modalConfig[permissionName]?.[withStatus],
    } as PermissionConfig
  }
  const config = getConfig(debouncedStatus)

  function onPermissionResolve(_status?: PermissionTypes.PermissionStatus) {
    modalState?.props?.onPermissionResolve?.(_status || status)

  }

  onUpdate(() => {

    if (modalState?.visible && !!status) {

      if (status === 'granted') {
        reset()
        onPermissionResolve()
      } else {

        if (!deepEqual(config, getConfig(status))) {

          modals.transition(modalId, modalId, {
            props: modalState?.props,
          })
        }
      }

    }
  }, [status, modalState?.visible])

  async function onAllow() {

    switch (config.onAllow) {
      case 'ask':
        const newStatus = await permissionCtx.manager.get(permissionName, {
          ask: true,
          askOnDenied: true,
          askOnPending: true,
        })
        if (!newStatus.isGranted) {
          onPermissionResolve(newStatus.status)
        }
        break

      case 'openSettings':
      default:
        Linking.openSettings()
        break
    }

  }

  function onDeny() {
    onPermissionResolve()
  }

  return {
    onAllow,
    onDeny,
    modalId,
    permissionName,
    modalState: {
      ...modalState,

    },
    currentState,
    config,
  }
}

type PermissionManagerArgTypes<M extends PermissionManager<any, any>> = {
  perms: M extends PermissionManager<infer P, any> ? P extends Record<string, any> ? P : never : never
  opts: M extends PermissionManager<any, infer O> ? O : never
}

type CreateTypedPermissionHooksArgs<
  M extends PermissionManager<any, any>,
  Args extends PermissionManagerArgTypes<M> = PermissionManagerArgTypes<M>,
  ModalConfig extends PermissionModalsConfig<keyof Args['perms']> = PermissionModalsConfig<keyof Args['perms']>
> = {
  modalConfig: ModalConfig
  permissionsManager: M
}

export function createTypedPermissionHooks<
  M extends PermissionManager<any, any>,
  Args extends PermissionManagerArgTypes<M> = PermissionManagerArgTypes<M>
// eslint-disable-next-line @typescript-eslint/no-unused-vars
>(configuration: CreateTypedPermissionHooksArgs<M>) {

  const _usePermissions = usePermissions as UsePermissions<Exclude<keyof Args['perms'], number | symbol>>
  const _usePermissionModal = usePermissionModal as ((name: keyof Args['perms']) => ReturnType<typeof usePermissionModal>)

  return {
    usePermissions: _usePermissions,
    usePermissionModal: _usePermissionModal,

  }
}