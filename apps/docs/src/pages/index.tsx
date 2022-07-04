import { Button, Text, LocalStorageKeys, React } from '@/app'
import { AppStatusOverlay, Page, Link } from '@/components'
import { AppStatus, Session, useAppSelector } from '@/redux'
import { onMount, onUpdate, useComponentStyle } from '@codeleap/common'
import {
  View,
  variantProvider,
  Theme,

} from '@/app'
import { MultiSelect } from '@/MultiSelect'

export const Overlays = () => {
  return <>

    <AppStatusOverlay />
    {/* <DebugModal/> */}
  </>
}

const links = [
  {
    url: '/concepts/index',
    name: 'Fundamentals',
    description:
      'Fundamental design principles and motivation for creating this framework, along with platform agnostic environment setup',
  },
  {
    name: 'Modules',
    links: [
      {
        url: '/common/introduction',
        name: '@codeleap/common',
        description:
          'The library that provides APIs for building portable and modular code on both platforms',
      },
      {
        url: '/web/introduction',
        name: '@codeleap/web',
        description: 'Components and hooks for building awesome websites',
      },
      {
        url: '/mobile/introduction',
        name: '@codeleap/mobile',
        description: 'Components and utilities for creating bleeding edge iOS and Android apps',
      },
      {
        url: '/cli/introduction',
        name: '@codeleap/cli',
        description: 'Tools for organized and efficient project management',
      },
    ],
  },
]

const ListItem = ({ item, depth = 2, styles }) => {
  const mounted = useAppSelector(store => store.Session.appMounted)
  if (item.links) {
    return (
      <View
        variants={[
          'column',
          'justifyCenter',
          `marginLeft:${depth}` as any,
          'flex',
        ]}
        responsiveVariants={{
          mid: [`marginLeft:0`],
        }}

      >
        <Text text={item.name} variants={['h1']} responsiveVariants={{ mid: ['marginVertical:2'] }}/>
        <View variants={['gap:1', 'column', 'marginTop:3']}>

          {item.links.map((i) => (
            <ListItem item={i} depth={depth + 2} key={i.url} styles={styles}/>
          ))}
        </View>
      </View>
    )
  }
  return (
    <Link
      to={item.url}
      variants={['alignCenter', 'padding:2', 'flex']}
      css={styles.link}
    >
      <View variants={['column', 'marginVertical:2']}>
        <Text text={item.name} variants={[depth === 2 ? 'h1' : 'h2', 'marginBottom:2']} />
        <Text text={item.description} />
      </View>
      <Button
        variants={['circle', 'marginLeft:3']}
        icon='arrowForward'
        onPress={() => {}}
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
    ...theme.spacing.paddingVertical(5),
    ...theme.spacing.marginBottom(9),
    width: '100vw',
    flexDirection: 'column',
    [theme.media.down('mid')]: {
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
    <Page title='Home'>

      <View styles={{ wrapper: styles.wrapper }} title='Template'>

        {links.map((l) => (
          <ListItem item={l} key={l.name} styles={styles}/>
        ))}

      </View>
    </Page>
  )
}

export default IndexPage
