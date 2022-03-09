/** @jsx jsx */
import { jsx } from '@emotion/react'
import React, { Fragment } from 'react'
import { FileInputRef, TextInputProps } from '@codeleap/web'
import {
  FileInput,
  variants,
  TextInput,
  RadioInput,
  Checkbox,
  Button,
  Text,
  Select,
  View,
} from '@/app'
import { useRef, useState } from 'react'
import { iconOptions } from './shared'
import { Image } from '../../Image'
const FileInputShowcase = {
  render: ({ variants }) => {
    const fileInputRef = useRef<FileInputRef>(null)
    const [images, setImages] = useState([])
    return (
      <Fragment>
        <FileInput
          variants={variants}
          multiple
          ref={fileInputRef}
          onFileSelect={(f) => setImages([...images, ...f.map((p) => p.preview)])
          }
        />
        <Button
          text='Pick an image'
          onPress={() => fileInputRef.current.openFilePicker()}
        />
        {images.map((url, idx) => (
          <Image source={url} key={idx} css={{ height: 100, width: 100 }} type='dynamic' />
        ))}
      </Fragment>
    )
  },
  styleSheet: variants.FileInput,

}
const TextInputShowcase = {
  render: ({ variants, controlValues }) => {
    const [value, setValue] = useState('')

    const validate: TextInputProps['validate'] = (text) => {
      const isValid = text === 'THE WORLD WAS GONNA ROLL ME'
      return {
        result: isValid ? 'success' : 'error',
        message: isValid ? '' : "Didn't you learn this at school?",
      }
    }

    return (
      <Fragment>
        <Text text='Complete the sentence' variants={['marginBottom:2']} />
        <TextInput
          onChangeText={setValue}
          value={value}
          validate={validate}
          variants={variants}
          leftIcon={{
            name: controlValues.leftIcon,
          }}
          rightIcon={{
            name: controlValues.rightIcon,
          }}
          label={'SOMEBODY ONCE TOLD ME'}
          debugName={'Showcase example TextInput'}
        />
      </Fragment>
    )
  },
  styleSheet: variants.TextInput,
  controls: {
    leftIcon: iconOptions,
    rightIcon: iconOptions,
  },
}
const RadioInputShowcase = {
  render: ({ variants }) => {
    const options = [
      { label: 'Option 0', value: 0 },
      { label: 'Option 1', value: 1 },
      { label: 'Option 2', value: 2 },
    ]
    const [value, setValue] = useState(options[0].value)

    return (
      <RadioInput
        label='Select one'
        options={options}
        value={value}
        variants={variants}
        onValueChange={setValue}
      />
    )
  },
  styleSheet: variants.RadioInput,
}
const CheckboxShowcase = {
  render: ({ variants }) => {
    const [isChecked, setChecked] = useState(false)
    return (
      <Checkbox
        label='My checkbox'
        variants={variants}
        checked={isChecked}
        onValueChange={setChecked}
      />
    )
  },
  styleSheet: variants.Checkbox,
}

const SelectShowcase = {
  render: () => {
    const [value, setValue] = useState(null)
    const options = [
      { label: 'Option 0', value: 0 },
      { label: 'Option 1', value: 1 },
      { label: 'Option 2', value: 2 },
    ]
    return (
      <View variants={['column']}>
        <Text text={'Custom'} />
        <Select
          options={options}
          value={value}
          onValueChange={setValue}
          placeholder='Select Example'
        />
        <Text text={'Native'} />
        <Select
          type='native'
          options={options}
          value={value}
          onValueChange={setValue}
          placeholder='Select Example'
        />
      </View>
    )
  },
  styleSheet: variants.Select,
}

export {
  CheckboxShowcase as Checkbox,
  TextInputShowcase as TextInput,
  RadioInputShowcase as RadioInput,
  FileInputShowcase as FileInput,
  SelectShowcase as Select,
}
