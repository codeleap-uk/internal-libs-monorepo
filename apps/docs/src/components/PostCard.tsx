import { Text, Theme, View, React, Icon, Touchable, variantProvider } from '@/app'
import { Post } from '@/redux'
import { useComponentStyle } from '@codeleap/common'
import moment from 'moment'

type PostCardProps = {
  post: Post
  style?: any
  remove:(id:Post['id']) => any
  edit?: (() => any) | null
}

export const PostCard:React.FC<PostCardProps> = ({ post, style, remove, edit }) => {
  const {
    content,
    created_datetime,
    title,
    username,
    id,
  } = post

  const date = moment(created_datetime).format('Do of MMM YY')
  const styles = useComponentStyle(componentStyles)

  return (
    <View
      variants={['column', 'fullWidth']}
      css={style}
    >
      <View style={styles.innerWrapper}>
        <View variants={['row', 'justifySpaceBetween']}>
          {
            remove &&
            <Touchable onPress={() => remove(id)} debugName={'Delete post'}>
              <Icon name={'close'} style={{ size: 28 }} />
            </Touchable>
          }
        </View>

        <View variants={['row', 'justifySpaceBetween', 'marginBottom:1']}>
          <Text text={`@${username}`} variants={['h4', 'primary']} />
          <Text text={`${date}`} variants={['p2']} />
        </View>

        <Text text={title} variants={['h3']} />

        <View variants={['row', 'justifySpaceBetween']}>
          <Text text={content} variants={['p1', 'marginTop:1']} />
          {
            edit &&
          <Touchable onPress={() => edit()} debugName={'Edit post'}>
            <Icon name={'edit'} style={{ size: 25 }} />
          </Touchable>
          }
        </View>
      </View>
    </View>)
}

export default PostCard

const componentStyles = variantProvider.createComponentStyle((theme) => ({
  innerWrapper: {
    marginHorizontal: theme.spacing.value(2),
    marginBottom: theme.spacing.value(2),
    padding: theme.spacing.value(2),
    borderRadius: theme.borderRadius.medium,
    backgroundColor: theme.colors.backgroundSecondary,
    ...theme.presets.elevated,
    ...theme.presets.column,
  },
}))
