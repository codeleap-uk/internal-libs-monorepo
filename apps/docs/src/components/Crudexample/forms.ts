import { createForm } from '@codeleap/common'
import * as yup from 'yup'

export const postForm = createForm('post', {
  title: {
    type: 'text',
    placeholder: 'Title',
    validate: yup
      .string()
      .required('This is a required field')
      .min(6, 'Minimum of 6 characters')
      .max(128, 'Maximum of 128 characters'),
  },
  content: {
    type: 'text',
    placeholder: 'Content',
    validate: yup
      .string()
      .required('This is a required field')
      .min(6, 'Minimum of 6 characters')
      .max(500, 'Maximum of 500 characters'),
  },
})

export const editPostForm = createForm('editPost', {
  title: {
    type: 'text',
    placeholder: 'Title',
    validate: yup
      .string()
      .required('This is a required field')
      .min(6, 'Minimum of 6 characters')
      .max(128, 'Maximum of 128 characters'),
  },
  content: {
    type: 'text',
    placeholder: 'Content',
    validate: yup
      .string()
      .required('This is a required field')
      .min(6, 'Minimum of 6 characters')
      .max(500, 'Maximum of 500 characters'),
  },
})
