import * as Form from './types'

export const defaultFieldValues: Partial<Record<Form.FormField['type'], any>> =
  {
    checkbox: false,
    text: '',
    composite: {},
    file: null,
    multipleFile: [],
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
    multipleFile: 'onFileSelect',
    number: 'onChangeText',
  }

