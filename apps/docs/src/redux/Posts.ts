import { api } from '../app'
import { createSlice } from '@codeleap/common'

export type Post = {
  id: number
  username: string
  created_datetime: string
  title: string
  content: string
}

type PostState = {
  posts: Post[]
  loading: boolean
  error: {
    message: string
  } | null
}

const initialState: PostState = {
  posts: [],
  loading: false,
  error: null,
}

export const postsSlice = createSlice({
  name: 'Posts',
  initialState,
  reducers: {},
  asyncReducers: {
    getData: async (state, setState) => {
      setState({ loading: true })
      api
        .get('careers/')
        .then(({ data }) => {
          setState({ loading: false, posts: data.results })
        })
        .catch((e) => {
          logger.error('Error fetching posts', e, 'API')
          setState({
            loading: false,
            error: {
              message: 'Error fetching data',
            },
          })
        })
    },
  },
})
