import { useImperativeHandle } from "react"
import { IFieldRef } from "../types"

export function useFieldBinding<T>(ref: React.Ref<IFieldRef<T>>, impl: Partial<IFieldRef<T>>, deps = []){

  const notImplemented = (method: string) => {
    throw new Error(`ref.${method} not implemented for ${this._type} field`)
  }
 

  useImperativeHandle(ref, ( ) => ({
    blur: () => {
      notImplemented('blur')
    },
    emit: () => {
      notImplemented('emit')
    },
    focus: () => {
      notImplemented('focus')
    },
    // @ts-expect-error
    getValue: () => {
      notImplemented('getValue')
    },
    scrollIntoView: async () => {
      notImplemented('scrollIntoView')
    },
    hideValue() {
      notImplemented('hideValue')
    },
    revealValue(){
      notImplemented('revealValue')
    },
    toggleValueVisibility(){
      notImplemented('toggleValueVisibility')
    },
    ...impl
  }), deps)

}