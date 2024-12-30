import { createStateSlice, GlobalState, globalState } from "@codeleap/store"
 
import { TypeGuards } from "@codeleap/types"
import { useMemo } from "react"
import { FieldPaths, FieldPropertyTuples, FieldTuples, FormDef, FormValues } from "../newtypes"




function buildState<T extends FormDef>(def: T) {
  const stateArg = {}

  for(const [name, field] of Object.entries(def)) {
    stateArg[name] = field.value
  }

  return stateArg as FormValues<T>
}

class Form<T extends FormDef> {
  id: string
  fields: T
  state: GlobalState<FormValues<T>>

  
  constructor(id: string, shape: T) {
    this.id = id
    this.fields = shape    

    this.state = globalState(
      buildState(this.fields)
    )

    this.attachState()
  
  }

  get values(){
    return this.state.get()
  }

  get isValid(){
    const res = this.validate()

    return Object.values(res).every(result => result.isValid)
  }

  slice<K extends FieldPaths<T>>(field: K) {
    
    const fieldSlice = createStateSlice(
      this.state, 
      (v) => v[field], 
      (value) => {
        return {
          [field]: value
        } as FormValues<T>
      }
      
    )

    return fieldSlice
  }

  iterFields<V>(cb: (field: FieldTuples<T>, index: number) => V){
    const results:V[] = []
    let index = 0

    for(const [name, field] of Object.entries(this.fields)) {
      const result = cb([ name, field ] as FieldTuples<T>, index)

      results.push(result)

      index++
    }

    return results
  }

  attachState(){
    this.iterFields(([name, field]) => {
      field.options.name = name
    
      field.attach(
        this.slice(name)
      )
    })
  }

  validate(fields?: FieldPaths<T>){

    const validateFields = fields ?? Object.keys(this.fields)

    const results = this.iterFields(([name, field]) => {
      if(!validateFields.includes(name)) return null

      return [name, field.validate()] as FieldPropertyTuples<T, '__validationRes'>
    })

    const resultMap = Object.fromEntries(
      results.filter(v => !TypeGuards.isNil(v))
    )

    return resultMap
  }

  register(field: FieldPaths<T>) {
    return this.fields[field].props()
  }

}


export function useForm<T extends FormDef>(name: string, def: T) {
  const form = useMemo(() => {
    return new Form(name, def)
  }, [name])

  
  return form
}

export function form<Def extends FormDef>(...args: ConstructorParameters<typeof Form<Def>>) {
  return new Form(...args)
}
