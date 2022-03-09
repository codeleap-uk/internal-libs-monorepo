import { useAppSelector } from '@/redux'
import { Button, Text, variantProvider, View } from '@/app'
import { Avatar, Page, RequiresAuth, Link } from '@/components'
import { navigate } from 'gatsby'

const Section = ({ name, value }) => {
  return <View variants={['gap:1', 'column']}>
    <Text text={name} variants={['h4']}/>
    <Text text={value} />
  </View>
}

const ViewProfile = () => {
  const { profile } = useAppSelector((store) => store.Session)

  return <Page title={`${profile?.first_name || ''}`} footer={false} styles={{ wrapper: { flex: 1 }}}>
    <RequiresAuth onUnauthorized={() => navigate('/')}>
      <View variants={['gap:4', 'flex', 'alignCenter']} responsiveVariants={{ small: ['column'] }}>
        <Avatar profile={profile} debugName={'View Profile Avatar'}/>
        <View variants={['column', 'gap:2']}>
          <Section name='Name' value={`${profile?.first_name} ${profile?.last_name}`} />
          <Section name='Email' value={profile?.email} />
          <Link to='edit' variants={['marginTop:auto']}>
            <Button text={'Edit'} />
          </Link>
        </View>
      </View>
    </RequiresAuth>
  </Page>
}

export default ViewProfile

