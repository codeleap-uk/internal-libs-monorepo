import { React, theme } from '@/app'
import { Text, View, Icon, Checkbox } from '@/components'
import { useCodeleapContext, useState, useMemo, TypeGuards, useBooleanToggle } from '@codeleap/common'
import Highlight, { defaultProps } from 'prism-react-renderer'
import { Image } from '../Image'
import { Link } from '../Link'
import { PhotoView } from 'react-photo-view'
import { CodeThemes } from '../../app/stylesheets/Code'
import { createStyles } from '@codeleap/styles'

const quoteTypes = {
  info: 'INFO',
  note: 'NOTE',
  warning: 'WARNING',
  danger: 'DANGER',
  tip: 'TIP',
}

const blockquoteStyles = createStyles((theme) => {
  const s = {}
  Object.keys(quoteTypes).forEach(k => {
    s[k] = {
      ...theme.border({
        directions: ['left'],
        width: 5,
        style: 'solid',
        color: k,
      }),
      backgroundColor: theme.colors[k] + '20',
      borderRadius: theme.borderRadius.small,
    }

    s[`${k}-icon`] = {
      color: theme.colors[k],
      height: 24,
      width: 24,
      alignSelf: 'flex-start',
      ...theme.spacing.marginRight(1),
    }
  })
  return s
})

const getSectionId = (content: string) => {
  return content?.toLocaleLowerCase()?.replaceAll(' ', '-')?.replaceAll('?', '')
}

export const mdxTransforms = {
  h1: ({ children }) => <Text style={['h1']} id={getSectionId(children)} text={children} />,
  h2: ({ children }) => <Text style={['h2']} id={getSectionId(children)} text={children} />,
  h3: ({ children }) => <Text style={['h3']} id={getSectionId(children)} text={children} />,
  h4: ({ children }) => <Text style={['h4']} text={children} />,
  h5: ({ children }) => <Text style={['h5']} text={children} />,
  h6: ({ children }) => <Text style={['p1']} text={children} />,
  blockquote: ({ children }) => {
    const quoteType = useMemo(() => {

      let elChildren: Array<any> = Array.isArray(children) ? children : children?.props?.children
      if (!Array.isArray(elChildren)) elChildren = ['', elChildren]
      let qt = elChildren?.[1]?.props?.children

      if (TypeGuards.isArray(qt)) {
        for (const quote_content of qt) {
          if (TypeGuards.isString(quote_content)) {
            quote_content?.split(' ')?.find(partial_str => {
              if (!!quoteTypes?.[partial_str.toLocaleLowerCase()]) {
                qt = partial_str
              }
            })
          }
        }
      }

      if (TypeGuards.isString(qt)) {


        const typeEntry = Object.entries(quoteTypes).find(t => qt.startsWith(t[1]))

        if (!typeEntry) {
          return {
            key: null,
            value: null,
            formattedChildren: elChildren,
          }
        }

        const isStringContent = TypeGuards.isString(elChildren?.[1]?.props?.children)

        const formattedChildren = [
          (isStringContent 
            ? elChildren?.[1]?.props?.children
            : elChildren?.[1]?.props?.children[0]
          ).replace(new RegExp('\\b' + typeEntry[1] + '\\b', 'g'), ''),
          ...(isStringContent ? [] : elChildren?.[1]?.props?.children?.slice(1)),
        ]

        return {
          key: typeEntry[0],
          value: typeEntry[1],
          formattedChildren,
        }
      }
      return {
        key: 'info',
        value: 'INFO',
        formattedChildren: elChildren,
      }
    }, [children?.props?.children?.[0]])

    return <View component='blockquote' style={['padding:2', 'fullWidth', 'alignCenter']} css={[quoteType?.value && blockquoteStyles[quoteType.key]]}>
      {
        quoteType?.key && (
          <Icon name={`docsquote-${quoteType?.key}`} size={24} style={blockquoteStyles[quoteType.key + '-icon']} />
        )
      }
      <Text style={{ textDecoration: 'none' }}>

        {
          quoteType.formattedChildren.map((c, idx, arr) => {
            if (TypeGuards.isString(c)) {
              return c

            }

            return c
          })
        }
      </Text>

    </View>
  },
  input: (props) => {
    const [checked, setChecked] = useBooleanToggle(props.checked)
    return <Checkbox {...props} style={['inline']} checked={checked} onValueChange={setChecked} />
  },
  p: ({ children }) => <Text text={children} />,
  inlineCode: ({ children }) => {

    return <View style={['inlineFlex', 'paddingHorizontal:0.5']}>
      <Text text={children} style={['code', 'inline']} />
    </View>
  },
  ul: ({ children }) => {

    return <View style={['column', 'gap:1', 'paddingLeft:2']} component='ul'> {children} </View>
  },
  ol: ({ children }) => {

    return <View style={['column', 'gap:1', 'paddingLeft:2']} component='l'> {children} </View>
  },
  li: ({ children }) => {
    return <Text component='li' text={children} />
  },
  pre: (props) => {
    const className = props.children.props.className || ''
    const matches = className.match(/language-(?<lang>.*)/)
    const [hover, setHover] = useState(false)
    const { currentTheme } = useCodeleapContext()

    const code = props.children.props.children.trim()

    return (
      <Highlight
        {...defaultProps}
        code={code}
        language={
          matches && matches.groups && matches.groups.lang
            ? matches.groups.lang
            : ''
        }
        theme={CodeThemes[currentTheme]}

      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => {
          return <View 
          style={['column', 'relative', 'fullWidth', 'padding:2', 'borderRadius:small', {
            backgroundColor: style.backgroundColor,
            overflowX: 'scroll',
            maxWidth: 'calc(100vw - 620px)',

            [theme.media.down('tabletSmall')]: {
              maxWidth: 'calc(100vw)',
            }
          }]} onHover={setHover}>
            <pre
              className={className + ' code_style'}
              style={style}

            >

              {tokens.map((line, i) => (
                <div {...getLineProps({ line, key: i })}>
                  {line.map((token, key) => (
                    <span {...getTokenProps({ token, key })} />
                  ))}
                </div>
              ))}

            </pre>
          </View>
        }}
      </Highlight>
    )
  },
  img: (props) => {
    const fullSrc = `/images/${props.src}`

    return <>
      <PhotoView src={fullSrc}>
        <Image source={fullSrc} alt={props?.alt} style={{ height: undefined, maxWidth: '100%', objectFit: 'contain' }} />
      </PhotoView>
      <Text text={props.alt} style={['textCenter']} />
    </>
  },
  a: (props) => {
    const isExternal = useMemo(() => {
      try {
        const url = new URL(props.href)

        if (url.origin !== window.location.origin) {
          return true
        }
      } catch (e) {}
      
      return false
    }, [props.href])

    return <Link to={props.href} text={props.children} style={['color:primary3', 'noUnderline']} openNewTab={isExternal} />
  },
}

