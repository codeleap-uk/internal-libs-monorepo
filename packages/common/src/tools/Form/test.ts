import * as yup from 'yup'
import { useForm, createForm } from '.'


const myForm = createForm('myForm', {
  emailAddress: {
    type: 'text',
    defaultValue: 'Some text',
    validate: yup.string().length(5, 'This should be 5'),
  },
  subscriptions: {
    type: 'composite',
    fields: {
      newsletter: {
        type: 'checkbox',
        required: true,
        debounce: 1000,
        disabled: true,
        subtitle: '',
      },
      podcast: {
        type: 'checkbox',
      },
    },
  },
})

  
const FormExample = () => {
  const {setFieldValue, values, register} = useForm(myForm, 
    {
      output: 'json',
      validateOn: 'blur',
    },
  )
  
  console.log(register('subscriptions.newsletter'))
 
}
FormExample()
export default FormExample
