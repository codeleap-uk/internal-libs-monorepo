import { Text, Button } from '@/app'
import CodeThemes from '@/app/stylesheets/Code'
import { useCodeleapContext } from '@codeleap/common'
import Highlight, { defaultProps } from 'prism-react-renderer'

function copy(text:string) {
  return text
}

export const mdxTransforms = {
  h1: ({ children }) => <Text variants={['h1']} id={`section-${children}`} text={children}/>,
  h2: ({ children }) => <Text variants={['h2']} id={`section-${children}`} text={children}/>,
  h3: ({ children }) => <Text variants={['h3']} text={children}/>,
  h4: ({ children }) => <Text variants={['h4']} text={children}/>,
  h5: ({ children }) => <Text variants={['h5']} text={children}/>,
  h6: ({ children }) => <Text variants={['h6']} text={children}/>,
  p: ({ children }) => <Text text={children}/>,
  pre: (props) => {
    const className = props.children.props.className || ''
    const matches = className.match(/language-(?<lang>.*)/)

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
          return <pre className={className + ' code_style'} style={style}>
            <Button icon='copy' className='code_copy_btn' variants={['icon']} css={{
              position: 'absolute',
              right: 10,
              top: 10,
            }} onPress={() => copy(code)}/>
            {tokens.map((line, i) => (
              <div {...getLineProps({ line, key: i })}>
                {line.map((token, key) => (
                  <span {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))}
          </pre>
        }}
      </Highlight>
    )
  },
}
