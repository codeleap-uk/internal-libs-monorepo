import { Button, View, TextInput, ContentView, Modal, variantProvider, Theme, Text } from '@/app'
import React from 'react'
import { onMount, onUpdate, useForm, useBooleanToggle, useComponentStyle } from '@codeleap/common'

import { usePostsApi } from './apis/posts'
import { PostCard } from './components/PostCard'
// import { Scroll } from '@codeleap/mobile'
import { useState } from 'react'
import { editPostForm, postForm } from './forms'
import { AppStatus, useAppSelector } from '@/redux'
import { Page } from '@/components'

export const CrudExample:React.FC = () => {
  const { queries, data } = usePostsApi()
  const { getPosts, addPost, deletePost, editPost } = queries
  const [isChanged, setIsChanged] = useState(false)
  const [editID, setEditID] = useState(null)
  const [isModalOpen, setModal] = useBooleanToggle(false)
  const { profile, isLoggedIn } = useAppSelector(store => store.Session)

  const fetch = async () => {
    await getPosts.send(20)
  }

  onMount(() => {
    fetch()
  })

  onUpdate(() => {
    if (isChanged) {
      fetch()
      setIsChanged(false)
    }
  }, [isChanged])

  const form = useForm(postForm, {
    output: 'json',
    validateOn: 'blur',
  })

  const editForm = useForm(editPostForm, {
    output: 'json',
    validateOn: 'blur',
  })

  const username = `${profile?.first_name} ${profile?.last_name}`

  const createPost = async () => {
    await addPost.send({
      username,
      ...form.values,
    })
    form.reset(['values'])
  }

  const removePost = async (id) => {
    await deletePost.send(id)
    setIsChanged(true)
  }

  const modifyPost = () => {
    const data = {
      id: editID,
      title: editForm.values.title,
      content: editForm.values.content,
    }

    editPost.send(data).then(() => {
      setModal()
      setIsChanged(true)
    })
  }

  const openEdit = (data) => {
    setModal()
    editForm.setFormValues({
      title: data.title,
      content: data.content,
    })
    setEditID(data.id)
  }

  const styles = useComponentStyle(componentStyles)
  const isMobile = Theme.hooks.down('small')
  return (
    // <Scroll onRefresh={fetch}>
    <Page styles={{ innerWrapper: styles.wrapper }} title={'CRUD Example'}>
      <View variants={['column', 'flex', 'padding:2']} css={styles.posts}>
        <Text variants={['h3', 'marginVertical:3', 'alignSelfCenter']} text={'Codeleap Social'}/>
        <ContentView variants={['column', 'marginTop:2']} placeholderMsg='' loading={getPosts.isLoading} >
          {
            data.map((p) => {
              const editable = username === p.username

              return <PostCard
                key={p.id}
                remove={editable ? removePost : null}
                edit={editable ? (() => openEdit(p)) : null}
                post={p}
              />
            })
          }
        </ContentView>
      </View>

      {
        isLoggedIn ?
          (
            <View variants={['column', 'gap:1']} css={styles.newPost}>
              <Text variants={['h4', 'marginBottom:2']} text={'Create a post'}/>
              <TextInput {...form.register('title')} debugName={'Post title input'}/>
              <TextInput {...form.register('content')} debugName={'Post content input'} multiline rows={10}/>
              <Button onPress={createPost} text={'Submit'} loading={addPost.isLoading} debugName={'Create post'} variants={['marginTop:2']}/>
            </View>
          )
          :
          <View variants={['column']} css={styles.newPost}>
            <Text variants={['h4', 'marginBottom:2']} text={'Login to create posts'}/>
            <Button text={'Login'} onPress={() => AppStatus.setModal('auth')}/>
          </View>
      }

      <Modal
        visible={isModalOpen}
        showClose
        title={'Edit Post'}
        debugName={'Edit post modal'}
        toggle={setModal}
      >
        <ContentView placeholderMsg='' loading={editPost.isLoading} variants={['alignSelfStretch']}>

          <View variants={['marginTop:3', 'column', 'flex', 'alignSelfStretch', 'padding:3', 'gap:2']}>
            <TextInput {...editForm.register('title')} debugName={'Edit Post title input'} />
            <TextInput {...editForm.register('content')} debugName={'Edit Post content input'}
              multiline rows={isMobile ? 3 : 10} />
            <Button onPress={modifyPost} disabled={!editForm.isValid} variants={['marginHorizontal:auto', 'gray']} text={'Edit'} debugName={'Edit post'}/>
          </View>
        </ContentView>
      </Modal>
    </Page >
  )
}

const componentStyles = variantProvider.createComponentStyle((theme) => ({
  wrapper: {
    ...theme.presets.relative,
    [theme.media.down('small')]: {
      ...theme.presets.column,

    },
  },
  refreshIcon: {
    color: theme.colors.white,
    size: 30,
  },
  newPost: {
    flex: 0.4,
    position: 'sticky',
    top: theme.values.headerHeight + 20,
    right: 0,
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.backgroundSecondary,
    marginHorizontal: theme.spacing.value(2),
    padding: theme.spacing.value(2),
    borderRadius: theme.borderRadius.medium,
    ...theme.presets.elevated,
    [theme.media.down('small')]: {

      position: 'static',
      top: 'unset',
      order: 0,
      alignSelf: 'stretch',
    },
  },
  posts: {

    [theme.media.down('small')]: {
      order: 1,
    },
  },
}))

export default CrudExample
