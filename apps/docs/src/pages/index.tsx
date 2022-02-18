import { React,   Button, Modal, Text, LocalStorageKeys } from '@/app'
import { AppStatusOverlay } from '@/components'
import {  AppStatus, Session, useAppSelector } from '@/redux'
import { onMount, onUpdate, useComponentStyle } from '@codeleap/common'
import {
  View,
  Link,
  variantProvider,
  Theme,

} from '@/app'

export const Overlays = () => {
  const {isModalOpen} = useAppSelector(store => ({ isModalOpen: store.AppStatus.modals}))

  return <>


    <AppStatusOverlay />
  
    <Modal
      open={isModalOpen.test}
      showClose
      title={'hello'}
      toggle={() => AppStatus.setModal('test')}
      // debugName='Home'
    >
      <Text variants={['center']} text='Some text' />
      <Text variants={['center']} text='Some text' />
      <Text variants={['center']} text='Some text' />
      <Text variants={['center']} text='Some text' />
      <Text variants={['center']} text='Some text' />
      <Text variants={['center']} text='Some text' />
      
      <Button text='Do something' onPress={() => AppStatus.setModal('test')} />
    </Modal>
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
          `marginLeft:${depth}` as any,
          'paddingVertical:2',
          'justifySpaceBetween',
        ]}
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
      variants={['alignCenter', 'padding:2', 'marginVertical:2']}
      css={styles.link}
    >
      <View variants={['column']}>
        <Text text={item.name} variants={['h3']} />
        <Text text={item.description}  />
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
    minHeight: '100vh',
    width: '100vw',
    backgroundColor: theme.colors.background,
    flexDirection: 'column',
  },
}), false)

const IndexPage: React.FC = () => {
  const { isLoggedIn } = useAppSelector((store) => store.Session)
  
  onMount(() => {
    Session.setMounted()
    Session.autoLogin()

    const data = localStorage.getItem(LocalStorageKeys.SESSION_IS_DEV)
    if (data){
      Session.setMode(data === 'true')
    }

    setTimeout(() => {
      variantProvider.setColorScheme(variantProvider.theme.theme === 'dark' ? 'light' : 'dark')
    }, 2000)
  })

  onUpdate(() => {
    AppStatus.setReady(isLoggedIn)
  }, [isLoggedIn])

  const styles = useComponentStyle(componentStyle)


  return (
    <View styles={{ wrapper: styles.wrapper }} title='Template'>
      {links.map((l) => (
        <ListItem item={l} key={l.name} styles={styles}/>
      ))}
      <Button text={variantProvider.theme.theme} onPress={() => {
        variantProvider.setColorScheme(variantProvider.theme.theme === 'dark' ? 'light' : 'dark')
      }}/>
    </View>
  )
}

export default IndexPage
