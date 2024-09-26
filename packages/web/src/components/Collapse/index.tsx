import { CollapseProps } from './types'
import { useStylesFor } from '../../lib/hooks/useStylesFor'
import { AnyRecord, IJSX, StyledComponentProps } from '@codeleap/styles'
import { WebStyleRegistry } from '../../lib/WebStyleRegistry'
import { motion } from 'framer-motion'

export * from './styles'
export * from './types'

export const Collapse = (props: CollapseProps) => {
  const {
    open,
    children,
    style,
    ...rest
  } = {
    ...Collapse.defaultProps,
    ...props,
  }

  const styles = useStylesFor(Collapse.styleRegistryName, style)

  return (
    <motion.div
      initial={false}
      animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
      transition={{ duration: 0.2 }}
      {...rest}
      style={open ? styles?.['wrapper:open'] : styles?.['wrapper:closed']}
      // @ts-expect-error css type
      css={[styles.wrapper, open ? styles?.['wrapper:open'] : styles?.['wrapper:closed']]}
    >
      {children}
    </motion.div>
  )
}

Collapse.styleRegistryName = 'Collapse'
Collapse.elements = ['wrapper']
Collapse.rootElement = 'wrapper'

Collapse.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return Collapse as (props: StyledComponentProps<CollapseProps, typeof styles>) => IJSX
}

Collapse.defaultProps = {} as Partial<CollapseProps>

WebStyleRegistry.registerComponent(Collapse)
