import { Button, Text, LocalStorageKeys, React } from '@/app'
import { AppStatusOverlay, Page } from '@/components'
import { AppStatus, Session, useAppSelector } from '@/redux'
import { onMount, onUpdate, useComponentStyle } from '@codeleap/common'
import {
  View,
  Link,
  variantProvider,
  Theme,

} from '@/app'

export const Overlays = () => {
  return <>

    <AppStatusOverlay />
    {/* <DebugModal/> */}
  </>
}

const links = [
  {
    url: '/components',
    name: 'Components',
    description:
      'Playground for the components included in the libraries and this template',
  },
  {
    name: 'Examples',
    links: [
      {
        url: '/examples/redux',
        name: 'Redux',
        description:
          'Sample redux usage with the abstractions from our library',
      },
      {
        url: '/examples/crud',
        name: 'CRUD',
        description: 'How to use the query hook to fetch and send data',
      },
      {
        url: '/examples/form',
        name: 'Form',
        description: 'A simple form made with our custom form hook',
      },
    ],
  },
]

const ListItem = ({ item, depth = 2, styles }) => {

  if (item.links) {
    return (
      <View
        variants={[
          'column',
          'paddingVertical:2',
          'justifySpaceBetween',
          `marginLeft:${depth}` as any,
          'flex',
        ]}
        responsiveVariants={{
          small: [`marginLeft:0`],
        }}

      >
        <Text text={item.name} variants={['h3']} />
        {item.links.map((i) => (
          <ListItem item={i} depth={depth + 2} key={i.url} styles={styles}/>
        ))}
      </View>
    )
  }
  return (
    <Link
      to={item.url}
      variants={['alignCenter', 'padding:2', 'flex', 'marginVertical:1']}
      css={styles.link}
    >
      <View variants={['column', 'marginVertical:2']}>
        <Text text={item.name} variants={['h3', 'marginBottom:2']} />
        <Text text={item.description} />
      </View>
      <Button
        variants={['circle', 'marginLeft:auto']}
        icon='arrowForward'
      />
    </Link>
  )
}

const componentStyle = variantProvider.createComponentStyle((theme) => ({
  link: {
    display: 'flex',
    ...theme.border.primary(2),
    borderRadius: Theme.borderRadius.small,
  },
  wrapper: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    minHeight: '80vh',
    ...theme.spacing.paddingVertical(8),
    ...theme.spacing.marginBottom(9),
    width: '100vw',
    flexDirection: 'column',
    [theme.media.down('small')]: {
      gridTemplateColumns: 'repeat(1, 1fr)',
    },
  },
}), false)

const IndexPage: React.FC = () => {
  const { isLoggedIn } = useAppSelector((store) => store.Session)

  onMount(() => {
    Session.setMounted()
    Session.autoLogin()

    const data = localStorage.getItem(LocalStorageKeys.SESSION_IS_DEV)
    if (data) {
      Session.setMode(data === 'true')
    }

  })

  onUpdate(() => {
    AppStatus.setReady(isLoggedIn)
  }, [isLoggedIn])

  const styles = useComponentStyle(componentStyle)

  return (
    <Page>

      <View styles={{ wrapper: styles.wrapper }} title='Template'>

        {links.map((l) => (
          <ListItem item={l} key={l.name} styles={styles}/>
        ))}

      </View>
    </Page>
  )
}

export default IndexPage
