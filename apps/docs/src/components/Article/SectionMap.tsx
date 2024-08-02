import { React, theme } from '@/app'
import { View, Text, Icon, ActionIcon } from '@/components'
import { createStyles } from '@codeleap/styles'
import { useMediaQuery } from '@codeleap/web'
import { useLocation, WindowLocation } from '@reach/router'
import { useState } from 'react'
import { Collapse } from '../Collapse'
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
  const [open, setOpen] = useState(false)

  const mediaQuery = theme.media.down('tabletSmall')
  const isMobile = useMediaQuery(mediaQuery, { getInitialValueInEffect: false })

  const pathOrigin = location?.origin + location?.pathname

  const sections = content?.map((node, idx) => (
    <SectionText location={location} node={node} key={idx} pathOrigin={pathOrigin} />
  ))

  return (
    <View style={styles.wrapper}>
      <View style={['alignCenter', 'gap:2']}>
        {isMobile ? (
          <ActionIcon debugName='table content' name='layers' onPress={() => setOpen(!open)} />
        ): (
          <Icon debugName='table content' name='layers' size={20} />
        )}

        <Text style={['h4', 'color:primary3']} text={'Table of contents'} />
      </View>

      {isMobile ? <Collapse open={open}>{sections}</Collapse> : sections}
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
