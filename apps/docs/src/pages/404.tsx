import { Text, View } from '@/app'
import { Link, Page } from '@/components'

const Notfound:React.FC = () => {
  return <Page variants={['column', 'paddingVertical:12']} >

    <View variants={['column', 'alignCenter', 'gap:4']} >

      <Text text='Nothing here' variants={['h2']}/>
      <Text text='This page does not exist. It may have been moved or deleted.' />
      <Link text={'Back to home page'} to={'/'}/>
    </View>
  </Page>
}

export default Notfound
