import { React, Text, Button, View, Theme } from '@/app'
import CodeThemes from '@/app/stylesheets/Code'
import { copyToClipboard } from '@/utils/dom'
import { useCodeleapContext, useState, useMemo } from '@codeleap/common'
import Highlight, { defaultProps } from 'prism-react-renderer'
import { Link } from '../Link'
import { getHeadingId } from './utils'

function copy(text:string) {
  return copyToClipboard(text)
}

export const mdxTransforms = {
  h1: ({ children }) => <Text variants={['h1']} id={getHeadingId(children)} text={children}/>,
  h2: ({ children }) => <Text variants={['h2']} id={getHeadingId(children)} text={children}/>,
  h3: ({ children }) => <Text variants={['h3']} text={children}/>,
  h4: ({ children }) => <Text variants={['h4']} text={children}/>,
  h5: ({ children }) => <Text variants={['h5']} text={children}/>,
  h6: ({ children }) => <Text variants={['h6']} text={children}/>,

  p: ({ children }) => <Text text={children} />,
  inlineCode: ({ children }) => {

    return <View variants={['inlineFlex', 'paddingHorizontal:0.5']}>
      <Text text={children} variants={['code', 'inline']}/>
    </View>
  },
  ul: ({ children }) => {

    return <View variants={['column', 'gap:1', 'paddingLeft:2']} component='ul'> {children} </View>
  },
  ol: ({ children }) => {

    return <View variants={['column', 'gap:1', 'paddingLeft:2']} component='ul'> {children} </View>
  },
  li: ({ children }) => {
    return <Text component='li' text={children}/>
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
          return <View variants={['column', 'relative', 'fullWidth', 'codeWrapper']} onHover={setHover} css={{
            backgroundColor: style.backgroundColor,
          }}>
            {/* <Button icon='copy' className='code_copy_btn' variants={['icon']} css={{
              position: 'sticky',

              top: 8,
              left: '100%',

              zIndex: 1,
              transition: 'opacity 0.2s ease',
              opacity: hover ? 1 : 0,
            }} onPress={() => copy(code)}/> */}
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
  a: (props) => {
    return <Link to={props.href} text={props.children} openNewTab variants={['primary']}/>
  },
}

