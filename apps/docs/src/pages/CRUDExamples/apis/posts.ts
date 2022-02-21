import { api } from '@/app'
import { Post } from '@/redux'
import { useQuery } from '@codeleap/common'

const MODULE_NAME = 'careers/'

export const usePostsApi = () => useQuery({
  initialState: [] as Post[],
  routes: {
    getPosts: async (state, amount:number) => {
      const { data: { results }} = await api.get(MODULE_NAME, {
        params: {
          limit: amount,
        },
      })

      state.setState(results)

      return results
    },
    addPost: async (state, postData) => {
      const { data } = await api.post(MODULE_NAME, postData)

      state.setState([data, ...state.currentValue])

      return data
    },
    deletePost: async (state, id) => {
      const suffix = `${id}/`
      const { data } = await api.delete(MODULE_NAME + suffix)

      return data
    },
    editPost: async (state, newData) => {
      const { id, title, content } = newData
      const suffix = `${id}/`
      const { data } = await api.patch(MODULE_NAME + suffix, { title, content })

      return data
    },
  },
})
