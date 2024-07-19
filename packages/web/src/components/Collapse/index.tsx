import { capitalize, TypeGuards } from '@codeleap/common'
import { CollapseProps, GetCollapseStylesArgs } from './types'
import { CollapseComposition } from './styles'
import { useStylesFor } from '../../lib/hooks/useStylesFor'
import { AnyRecord, IJSX, StyledComponentProps } from '@codeleap/styles'
import { WebStyleRegistry } from '../../lib/WebStyleRegistry'

export * from './styles'
export * from './types'

export function getCollapseStyles<TCSS = React.CSSProperties, Return extends Record<CollapseComposition, TCSS> =
  Record<CollapseComposition, TCSS>>(args: GetCollapseStylesArgs): Return {

  const {
    direction = 'vertical',
    value,
    animation = '0.3s ease',
    scroll = false,
  } = args

  const dimension = direction === 'horizontal' ? 'width' : 'height'
  const capitalizedDimension = capitalize(dimension)
  const overflowOpen = scroll ? 'auto' : 'hidden'
  const axis = direction === 'vertical' ? 'Y' : 'X'

  return {
    'wrapper:closed': {
      ['display']: 'none',
      [`max${capitalizedDimension}`]: '0px',
      [`overflow${axis}`]: 'hidden',
    },
    'wrapper:open': {
      [`max${capitalizedDimension}`]: TypeGuards.isString(value) ? value : `${value}px`,
      [`overflow${axis}`]: overflowOpen,
    },
    wrapper: {
      height: 'auto',
      transition: `max-${dimension} ${animation}`,
    },
  } as unknown as Return
}

export const Collapse = (props: CollapseProps) => {
  const {
    open,
    size,
    children,
    direction,
    animation,
    style,
    ...rest
  } = {
    ...Collapse.defaultProps,
    ...props,
  }

  const styles = useStylesFor(Collapse.styleRegistryName, style)

  const componentStyles = getCollapseStyles({ value: size, direction, animation })

  return (
    <div
      {...rest}
      css={[
        componentStyles.wrapper,
        open ? componentStyles['wrapper:open'] : componentStyles['wrapper:closed'],
        styles.wrapper,
      ]}
    >
      {children}
    </div>
  )
}

Collapse.styleRegistryName = 'Collapse'
Collapse.elements = ['wrapper']
Collapse.rootElement = 'wrapper'

Collapse.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return Collapse as (props: StyledComponentProps<CollapseProps, typeof styles>) => IJSX
}

Collapse.defaultProps = {
  size: 1000,
} as Partial<CollapseProps>

WebStyleRegistry.registerComponent(Collapse)
