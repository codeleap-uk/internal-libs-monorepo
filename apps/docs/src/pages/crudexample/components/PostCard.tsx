import { Text, Theme, View, React, Icon, Touchable, variantProvider, Button } from '@/app'
import { Post } from '@/redux'
import { useComponentStyle } from '@codeleap/common'
import moment from 'moment'

const defaultStyle = {
  ...Theme.border.gray(1),
  borderRadius: Theme.borderRadius.small,
}

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
      css={[style, styles.wrapper]}
    >
      <View css={styles.innerWrapper}>
        <View variants={['justifyEnd', 'alignCenter', 'marginBottom:2']}>
          <Text text={title} variants={['h3', 'marginRight:auto']} />
          {
            edit &&
          <Button icon={'edit'} onPress={() => edit()} debugName={'Edit post'} variants={['icon']}/>

          }
          {
            remove &&
          <Button icon={'close'} onPress={() => remove(id)} debugName={'Remove post'} variants={['icon', 'marginLeft:3']} />
          }
        </View>

        <View variants={['row', 'justifySpaceBetween', 'marginBottom:1']}>
          <Text text={`@${username}`} variants={['h4', 'primary']} />
          <Text text={`${date}`} variants={['p2']} />
        </View>

        <View variants={['row', 'justifySpaceBetween']}>
          <Text text={content} variants={['p1', 'marginTop:1']} />

        </View>
      </View>
    </View>)
}

export default PostCard

const componentStyles = variantProvider.createComponentStyle((theme) => ({
  wrapper: {
  },
  innerWrapper: {
    ...theme.presets.column,

    marginBottom: theme.spacing.value(2),
    padding: theme.spacing.value(2),
    borderRadius: theme.borderRadius.medium,
    backgroundColor: theme.colors.backgroundSecondary,
    ...theme.presets.elevated,
  },
}))
