import { createStateSlice, GlobalState, globalState } from "@codeleap/store"
 
import { TypeGuards } from "@codeleap/types"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { FieldPaths, FieldPropertyTuples, FieldTuples, FormDef, FormValues, PropertyForKeys, ValidationResult } from "../types"




function buildState<T extends FormDef>(def: T) {
  const stateArg = {}

  for(const [name, field] of Object.entries(def)) {
    stateArg[name] = field.value
  }

  return stateArg as FormValues<T>
}


type FormSelector<T extends FormDef, S> = (form: Form<T>) =>  S



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

    return Object.values(res).every((result: ValidationResult<any, any>) => result.isValid)
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

  firstInvalid() {
    for(const [fieldName, field] of Object.entries(this.fields)){
      const validation = field.validate()

      if(!validation.isValid) return {
        field,
        validation,
      }
    }
  }

  validate<Fields extends FieldPaths<T>[] = FieldPaths<T>[]>(fields?: Fields): PropertyForKeys<T, Fields[number], '__validationRes'> {

    const validateFields = fields ?? Object.keys(this.fields)

    const results = this.iterFields(([name, field]) => {
      if(!validateFields.includes(name)) return null

      return [name, field.validate()] as FieldPropertyTuples<T, '__validationRes'>
    })

    const resultMap = Object.fromEntries(
      results.filter(v => !TypeGuards.isNil(v))
    )

    return resultMap as unknown as PropertyForKeys<T, Fields[number], '__validationRes'>
  }

  

  register(field: FieldPaths<T>) {
    if(!this.fields[field]){
      throw new Error(`Field "${field}" not found in "${this.id}" form`)
    } 
    return this.fields[field].props()
  }
 

  use<Selected>(selector: FormSelector<T, Selected>): Selected {

   
    const [selected, setSelected] = useState(() => selector(this))

    
    const reselect = useCallback(() => {
      setSelected(selector(this))
    }, [selector])

    useEffect(() => {
      return this.state.listen((value, previous) => {
        if(value != previous){
          reselect()
        }
      })      
    }, [reselect])

    

    return selected
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
