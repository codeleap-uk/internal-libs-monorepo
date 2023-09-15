import { variantProvider, Settings } from '@/app'

import { Footer } from './Footer'
import { Header } from './Header'
import { Helmet } from 'react-helmet'
import { onMount, PropsOf, useComponentStyle } from '@codeleap/common'
import { CenterWrapper, View } from '@/components'

type PageProps = PropsOf<typeof CenterWrapper> & {
  center?: boolean
  withRouter?: boolean
  basePath?: string
  title?: string
  header?:boolean|React.ReactElement
  footer?:boolean
  appendNameToTitle?: boolean
  className?: string
}

export const Page: React.FC<PageProps> = (props) => {
  const {
    children,
    center = true,
    basePath,
    title,
    appendNameToTitle = true,
    header = true,
    footer = true,
    withRouter,
    className,
    contentStyle = {},
    searchBar,
    ...centerWrapperProps
  } = props

  const content = withRouter ? (
    <>
      {children}
    </>
  ) : (
    children
  )

  const styles = useComponentStyle(componentStyles)
  return (
    <View variants={['column']} css={[styles.wrapper, !center && centerWrapperProps?.styles?.wrapper]} className={className}>
      {!withRouter && <Helmet>{title && <title>{title} {appendNameToTitle ? ` | ${Settings.AppName}` : ''}</title>}</Helmet>}
      {header && typeof header === 'boolean' ? <Header center={center} searchBar={searchBar} /> : header}
      {center ? (
        <CenterWrapper {...centerWrapperProps}>{content}</CenterWrapper>
      ) : (
        <View style={contentStyle}>

          {content}
        </View>
      )}

      {/* {footer && <Footer />} */}
    </View>
  )
}
const componentStyles = variantProvider.createComponentStyle((theme) => ({
  wrapper: {
    minHeight: '100vh',
    width: '100vw',
    maxWidth: '100%',
    backgroundColor: theme.colors.background,
  },
}))
