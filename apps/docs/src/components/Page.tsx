import { View, variantProvider, RouterPage, CenterWrapper, Settings } from '@/app'
import { CenterWrapperProps } from '@codeleap/web'

import { Footer } from './Footer'
import { Header } from './Header'
import { Helmet } from 'react-helmet'
import { useComponentStyle } from '@codeleap/common'

type PageProps = CenterWrapperProps & {
  center?: boolean
  withRouter?: boolean
  basePath?: string
  title?: string
  header?:boolean
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
    ...centerWrapperProps
  } = props

  const content = withRouter ? (
    <RouterPage basePath={basePath} title={title}>
      {children}
    </RouterPage>
  ) : (
    children
  )

  const styles = useComponentStyle(componentStyles)
  return (
    <View variants={['column']} css={[styles.wrapper, !center && centerWrapperProps?.styles?.wrapper]} className={className}>
      {!withRouter && <Helmet>{title && <title>{title} {appendNameToTitle ? ` | ${Settings.AppName}` : ''}</title>}</Helmet>}
      {header && <Header />}
      {center ? (
        <CenterWrapper {...centerWrapperProps}>{content}</CenterWrapper>
      ) : (
        content
      )}

      {footer && <Footer />}
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
