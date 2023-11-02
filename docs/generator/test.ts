import * as TypedocJSON from '../typedocs/web/test_components/Badge.json'

type Type = typeof TypedocJSON

const ignoredKeywords = ['css', 'style', 'styles', 'variants']

function main() {
  console.log('Test')

  const references: any[] = []
  let properties: any[] = []

  for (const _children of TypedocJSON.children) {
    for (const _type of _children.type.types) {

      if (_type.type === 'reference') {
        references.push(_type.name)
      } else if (_type.type === 'reflection') {
        console.log('General', _type)

        const childProps = _type.declaration?.children

        if (Array.isArray(childProps)) {
          for (const _prop of childProps) {
            const ignore = ignoredKeywords.includes(_prop.name)
            
            if (!ignore) {
              console.log('Prop', _prop)
              
              if (_prop?.type?.type == 'intrinsic') {
                properties.push({
                  optional: _prop?.flags?.isOptional,
                  name: _prop?.name,
                  type: _prop?.type?.name,
                })
              } else if (_prop?.type?.type == 'union') {
                // @ts-ignore
                const unionTypes = _prop?.type?.types?.map(t => t?.name)
                
                properties.push({
                  optional: _prop?.flags?.isOptional,
                  name: _prop?.name,
                  type: unionTypes?.join(' or '),
                })
              } else if (_prop?.type?.type == 'indexedAccess') {
                properties.push({
                  optional: _prop?.flags?.isOptional,
                  name: _prop?.name, // @ts-ignore
                  type: `${_prop?.type?.objectType?.name}[${_prop?.type?.indexType?.value}]`,
                })
              } else if (_prop?.type?.type == 'reference') {
                const refers: Array<any> = []

                function recursiveReference(typeArgs: typeof _prop.type) {
                  const hasTypeArguments = Array.isArray(typeArgs.typeArguments)

                  if (hasTypeArguments) {
                    refers.push(typeArgs?.name)

                    for (const args of typeArgs.typeArguments as any) {
                      recursiveReference(args as any)
                    }
                  } else if (typeArgs.type == 'query') {
                    // @ts-ignore
                    refers.push(typeArgs?.queryType?.name)
                  } else {
                    refers.push(typeArgs?.name)
                  }
                }

                recursiveReference(_prop.type)

                console.log('refers', refers)

                const referenceType = refers?.join('<')

                properties.push({
                  optional: _prop?.flags?.isOptional,
                  name: _prop?.name,
                  type: referenceType + (refers?.length > 1 ? '>' : ''),
                })
              } else if (_prop?.type?.type == 'reflection') {
                console.log('Reflection', _prop)
                const result: any = []
                // @ts-ignore
                const functions = _prop?.type?.declaration?.signatures

                if (Array.isArray(functions)) {
                  for (const _function of functions) {
                    const _return = _function.type.name

                    let functionResult = ''

                    _function.parameters.forEach((param, i) => {
                      // RECURSIVIDADE
                      const isLast = i == _function?.parameters?.length - 1
                      const isFirst = i == 0

                      functionResult = 
                        functionResult + 
                        (isFirst ? '(' : '') +
                        `${param?.name}: ${param?.type?.name}` +
                        (isLast ? ')' : '')
                    })

                    result.push(functionResult + ' => ' + _return)
                  }
                }

                console.log(result)

                properties.push({
                  optional: _prop?.flags?.isOptional,
                  name: _prop?.name,
                  type: result.join(' '),
                })
              } else {
                properties.push({
                  optional: _prop?.flags?.isOptional,
                  name: _prop?.name,
                  type: _prop?.type?.name,
                })
              }
            }
          }
        }
      }

    }
  }

  properties = properties.map(_p => {
    _p.optional = typeof _p.optional === 'boolean' ? _p.optional : false
    return _p
  })

  console.log({
    references,
    properties,
  })
}

main()
