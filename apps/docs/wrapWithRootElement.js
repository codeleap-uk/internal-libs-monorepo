import { Root } from './src/Root'

export function wrapRootElement({ element }) {
  return (
    <Root>
      {element}
    </Root>
  )
}
