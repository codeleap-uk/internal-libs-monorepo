import { React, Text, Link, variantProvider, View } from '@/app'
import { useComponentStyle } from '@codeleap/common'

const headings = ['h1', 'h2'] as const

type Node = {
  level: number
  text: string
  children?: Node[]
}

function mapSections(content) {
  const nodes:Node[] = []
  console.log(content)
  content.forEach(({ props }) => {
    const lastNode = nodes[nodes.length - 1]
    if (headings.includes(props?.mdxType)) {
      const level = Number(props.mdxType.replace('h', ''))

      if (lastNode && level > lastNode?.level) {
        nodes[nodes.length - 1].children.push({
          level,
          text: props.children,
          children: [],
        })
      } else {
        nodes.push({
          level,
          text: props.children,
          children: [],
        })
      }
    }
  })

  return nodes

}

const SectionText = (props:{node:Node}) => {
  const { node } = props

  if (node.level === 1) {
    return <View variants={['column', 'gap:2']}>
      <Link variants={['h4']} text={node.text} to={`#section-${node.text}`}/>
      {
        node.children?.map(node => <SectionText node={node} />)
      }
    </View>

  } else {

    return <Link variants={['h5', 'marginLeft:3']} text={node.text} to={`#section-${node.text}`}/>
  }
}

export const SectionMap:React.FC = ({ content }) => {
  const contentSections = mapSections(content)
  const styles = useComponentStyle(componentStyles)
  return <View css={styles.wrapper}>
    <Text variants={['h4', 'primary']} text={'Table of contents'}/>
    {
      contentSections.map(node => <SectionText node={node} />)
    }
  </View>
}

const componentStyles = variantProvider.createComponentStyle((theme) => ({
  wrapper: {
    backgroundColor: theme.colors.background,
    position: 'sticky',
    right: 0,
    bottom: 0,
    top: theme.values.headerHeight,
    maxHeight: theme.values.height - theme.values.headerHeight,
    ...theme.spacing.padding(2),
    ...theme.presets.alignSelfStretch,
    ...theme.presets.column,
    ...theme.border.grayFade({
      width: 1,
      directions: ['left'],
    }),
    ...theme.spacing.gap(2),
    flexBasis: '16%',
    [theme.media.down('small')]: {
      position: 'static',
      order: -1,
      ...theme.border.grayFade({
        width: 1,
        directions: ['bottom'],
      }),

    },
  },
}))
