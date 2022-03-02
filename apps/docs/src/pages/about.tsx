import { Text, Theme, variantProvider, View } from '@/app'
import { Page } from '@/components'
import licenses from '../app/license.json'

const aboutTextList = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Vel pharetra vel turpis nunc eget lorem dolor. Faucibus et molestie ac feugiat sed lectus. Netus et malesuada fames ac. Aliquet nibh praesent tristique magna. Ornare quam viverra orci sagittis eu volutpat odio facilisis. Maecenas ultricies mi eget mauris pharetra et ultrices. Turpis nunc eget lorem dolor sed viverra ipsum nunc aliquet. Turpis egestas integer eget aliquet nibh praesent. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Donec pretium vulputate sapien nec sagittis. Velit ut tortor pretium viverra suspendisse potenti nullam. Laoreet id donec ultrices tincidunt arcu. Facilisi cras fermentum odio eu. Consequat id porta nibh venenatis cras. Nisi vitae suscipit tellus mauris a diam. Et leo duis ut diam quam nulla porttitor massa. Massa eget egestas purus viverra accumsan in nisl.',
  'Euismod quis viverra nibh cras pulvinar mattis nunc sed. Feugiat sed lectus vestibulum mattis ullamcorper velit sed ullamcorper morbi. Nullam ac tortor vitae purus faucibus ornare suspendisse. Nunc scelerisque viverra mauris in aliquam. Vestibulum lorem sed risus ultricies tristique nulla aliquet. In hac habitasse platea dictumst quisque sagittis purus. Non enim praesent elementum facilisis leo vel fringilla est. Purus sit amet volutpat consequat mauris. Nunc sed blandit libero volutpat sed cras ornare arcu dui. Mauris pharetra et ultrices neque ornare aenean. Nullam eget felis eget nunc lobortis mattis aliquam faucibus. Id neque aliquam vestibulum morbi blandit cursus risus at ultrices. Ut placerat orci nulla pellentesque dignissim enim.',
]

const LicenseItem = ({ name, info }) => {
  const type = 'License type(s): ' + info.licenses
  const repo = 'Online repository: ' + info.repository
  const url = 'License URL: ' + info.licenseUrl
  return (
    <View component='li' variants={['column']}>
      <Text text={name} variants={['p1']} />
      <Text text={type} variants={['p3', 'marginTop:1', 'marginLeft:2']} />
      <Text text={repo} variants={['p3', 'marginTop:1', 'marginLeft:2']} />
      <Text text={url} variants={['p3', 'marginTop:1', 'marginLeft:2']} />
    </View>
  )
}

const About:React.FC = () => {
  return <Page title='About' variants={['column', 'paddingVertical:3']} styles={{ innerWrapper: { ...Theme.spacing.gap(3) }}}>
    <Text text={'About'} variants={['h2']} />
    <View variants={['gap:3', 'column']}>

      {
        aboutTextList.map((t) => <Text text={t}/>)
      }
    </View>

    <Text text={'Licenses'} variants={['h3']} />
    <View variants={['gap:3', 'column']}>
      {Object.entries(licenses)?.map(([name, info]) => (
        <LicenseItem key={name} name={name} info={info} />
      ))}
    </View>
  </Page>
}

export default About
