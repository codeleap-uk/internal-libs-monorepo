import { api } from '../app'
import { createSlice } from '@codeleap/common'

export type Post = {
  id: number;
  username: string;
  created_datetime: string;
  title: string;
  content: string;
};

type PostState = {
  posts: Post[];
  loading: boolean;
  error: {
    message: string;
  } | null;
};

const initialState: PostState = {
  posts: [],
  loading: false,
  error: null,
}

export const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  asyncReducers: {
    getData: async (state, setState) => {
      setState({ loading: true })
      api
        .get('/')
        .then(({ data }) => {
          setState({ loading: false, posts: data.results })
        })
        .catch(() => {
          setState({
            error: {
              message: 'Error fetching data',
            },
          })
        })
    },
  },
})
