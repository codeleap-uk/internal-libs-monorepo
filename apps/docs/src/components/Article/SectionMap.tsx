import { React } from '@/app'
import { View, Text, Icon } from '@/components'
import { createStyles } from '@codeleap/styles'
import { useLocation, WindowLocation } from '@reach/router'
import { Link } from '../Link'

type Node = {
  title: string
  url: string
  items: Node[]
}

type SectionTextProps = { 
  node: Node
  subContent?: boolean 
  pathOrigin: string 
  location: WindowLocation<any> 
}

const SectionText = (props: SectionTextProps) => {
  const { node, subContent = false, pathOrigin, location } = props

  const isSelected = location?.href?.includes(node?.url)

  return (
    <View style={['column', 'gap:2']}>
      <Link 
        style={['p3', 'noUnderline', subContent && 'marginLeft:1', isSelected && 'primary3']} 
        text={node?.title} 
        to={pathOrigin + node?.url} 
      />
      {node.items?.map((node, idx) => (
        <SectionText location={location} subContent node={node} key={idx} pathOrigin={pathOrigin} />
      ))}
    </View>
  )
}

export const SectionMap = ({ content = [] }) => {
  const location = useLocation()

  const pathOrigin = location?.origin + location?.pathname

  return (
    <View style={styles.wrapper}>
      <View style={['alignCenter', 'gap:2']}>
        <Icon debugName='table content' name='layers' size={20} />
        <Text style={['h4', 'primary']} text={'Table of contents'} />
      </View>

      {content?.map((node, idx) => (
        <SectionText location={location} node={node} key={idx} pathOrigin={pathOrigin} />
      ))}
    </View>
  )
}

const SECTION_WIDTH = 280

const styles = createStyles((theme) => ({
  wrapper: {
    backgroundColor: theme.colors.background,
    position: 'sticky',
    right: 0,
    bottom: 0,
    top: theme.values.headerHeight,
    maxHeight: theme.values.height - theme.values.headerHeight,
    ...theme.spacing.paddingLeft(3),
    ...theme.spacing.paddingRight(3),
    ...theme.spacing.paddingBottom(3),
    ...theme.presets.alignSelfStretch,
    ...theme.presets.column,
    ...theme.spacing.gap(2),
    flexBasis: '25%',
    paddingTop: theme.spacing.value(3),
    minWidth: SECTION_WIDTH,
    maxWidth: SECTION_WIDTH,
    borderLeft: `1px solid ${theme.colors.neutral3}`,

    [theme.media.down('tabletSmall')]: {
      minWidth: '100vw',
      maxWidth: '100vw',
      minHeight: 'unset',
    },
  },
}))
