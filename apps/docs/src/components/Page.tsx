import { variantProvider, Settings } from '@/app'
import { Header } from './Header'
import { Helmet } from 'react-helmet'
import { PropsOf } from '@codeleap/common'
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
  headerCenter?: boolean
}

export const Page = (props: PageProps) => {
  const {
    children,
    center = true,
    basePath,
    title,
    appendNameToTitle = true,
    header = true,
    footer = false,
    withRouter,
    className,
    contentStyle = {},
    searchBar,
    headerCenter = true,
    ...centerWrapperProps
  } = props

  return (
    <View variants={['column']} css={[styles.wrapper, !center && centerWrapperProps?.styles?.wrapper]} className={className}>
      {!withRouter && <Helmet>{title && <title>{title} {appendNameToTitle ? ` | ${Settings.AppName}` : ''}</title>}</Helmet>}
      {header && typeof header === 'boolean' ? <Header center={headerCenter ? center : false} searchBar={searchBar} /> : header}
      {center ? (
        <CenterWrapper {...centerWrapperProps}>{children}</CenterWrapper>
      ) : (
        <View style={{...contentStyle, position: 'relative'}}>
          {children}
        </View>
      )}
    </View>
  )
}

const styles = variantProvider.createComponentStyle((theme) => ({
  wrapper: {
    position: 'relative',
    minHeight: '100vh',
    width: '100vw',
    maxWidth: '100%',
    backgroundColor: theme.colors.background,
  },
}), true)
