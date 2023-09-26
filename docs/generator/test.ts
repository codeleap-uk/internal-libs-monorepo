import TypedocJSON from '../typedocs/web/test_components/ActivityIndicator.json'

type Type = typeof TypedocJSON

function main() {
  console.log('Test')

  for (const _children of TypedocJSON.children) {
    
    for (const _type of _children.type.types) {
      console.log(_type)
    }

  }
}

main()
