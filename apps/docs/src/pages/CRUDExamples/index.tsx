import { Button, View, TextInput, ContentView, Modal, variantProvider, Theme, Text } from '@/app'
import React from 'react'
import { onMount, onUpdate, useForm, useBooleanToggle } from '@codeleap/common'

import { usePostsApi } from './apis/posts'
import { PostCard } from './components/PostCard'
// import { Scroll } from '@codeleap/mobile'
import {  useState } from 'react'
import { editPostForm, postForm } from './forms'
import { useAppSelector } from '@/redux'

export const CrudExample:React.FC = () => {
  const { queries, data } = usePostsApi()
  const { getPosts, addPost, deletePost, editPost } = queries
  const [isChanged, setIsChanged] = useState(false)
  const [editID, setEditID] = useState(null)
  const [isModalOpen, setModal] = useBooleanToggle(false)
  const { first_name, last_name } = useAppSelector(store => store.Session.profile)

  const username = `${first_name} ${last_name}`

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
    validateOn: 'change',
  })

  const editForm = useForm(editPostForm, {
    output: 'json',
    validateOn: 'change',
  })

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

  return (
    // <Scroll onRefresh={fetch}>
    <View style={styles.wrapper}>
      <View variants={['center', 'row']}>
        <Text variants={['h3', 'marginVertical:3']} text={'CodeLeap Social'}/>
      </View>
      <View variants={['column']} style={styles.newPost}>
        <Text variants={['h4', 'marginBottom:2']} text={'Create a post'}/>
        <TextInput {...form.register('title')} debugName={'Post title input'}/>
        <TextInput {...form.register('content')} debugName={'Post content input'} multiline numberOfLines={50}/>
        <Button onPress={createPost} text={'Submit'} loading={addPost.isLoading} debugName={'Create post'}/>
      </View>

      <ContentView variants={['column', 'marginTop:2']} placeholderMsg='' loading={getPosts.isLoading}>
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

      <Modal
        visible={isModalOpen}
        showClose
        title={'Edit a Post'}
        debugName={'Edit post modal'}
        toggle={setModal}
        debugName='CRUD'
      >
        <ContentView placeholderMsg='' loading={editPost.isLoading}>

          <View variants={['marginTop:3']}>
            <TextInput {...editForm.register('title')} debugName={'Edit Post title input'} />
            <TextInput {...editForm.register('content')} debugName={'Edit Post content input'}
              multiline numberOfLines={50} styles={{ innerWrapper: { height: 100 }}}/>
            <Button onPress={modifyPost} variants={['marginHorizontal:auto', 'gray']} text={'Edit'} debugName={'Edit post'}/>
          </View>
        </ContentView>
      </Modal>
    </View>
    // </Scroll>
  )
}

const styles = variantProvider.createComponentStyle({
  wrapper: {
    // marginTop: Theme.values.safeAreaTop + Theme.spacing.value(3),
  },
  refreshIcon: {
    color: Theme.colors.white,
    size: 30,
  },
  newPost: {
    backgroundColor: Theme.colors.white,
    marginHorizontal: Theme.spacing.value(2),
    padding: Theme.spacing.value(2),
    borderRadius: Theme.borderRadius.medium,
    ...Theme.presets.elevated,
  },
})

export default CrudExample
