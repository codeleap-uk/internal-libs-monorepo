import * as Form from './types'

export const defaultFieldValues: Partial<Record<Form.FormField['type'], any>> =
  {
    checkbox: false,
    text: '',
    composite: {},
    file: null,
    'range-slider': [0, 100],
    slider: 1,
    number: '',
  }

export const changeEventNames: Partial<Record<Form.FormField['type'], string>> =
  {
    checkbox: 'onValueChange',
    'range-slider': 'onValueChange',
    slider: 'onValueChange',
    select: 'onValueChange',
    radio: 'onValueChange',
    text: 'onChangeText',
    file: 'onFileSelect',
    number: 'onChangeText',
  }

// const myForm = createForm({
//     something: {
//       type: 'composite',
//       fields: {
//         other: {
//           type: 'checkbox',
//         },
//       },

//     },

//     test: {
//       type: 'radio',
//       options: [
//         {
//           label: 'a',
//           'value': 'asdas',
//         },
//       ],
//       defaultValue: 'asd',
//       validate: yup.string().length(2, 'asddasdasdasd'),
//     },
//   })

// const CP = () => {
//     const form = useForm(myForm, {
//       output: 'json',
//       validateOn: 'blur',
//     })

//     form.setFieldValue('something', {
//       other: true,
//     })
//   }
