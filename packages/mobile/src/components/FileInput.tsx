import React, { ComponentPropsWithoutRef } from 'react'
import { Image as NativeImage } from 'react-native'
import { Text } from './Text'
import { Touchable } from './Touchable'
import { Image } from './Image'
import { DocumentPicker } from '../modules/documentPicker'
import { FastImage } from '../modules/fastImage'
import { FileInputComposition } from '@codeleap/common'
import { StylesOf } from '../types/utility'

type NativeImageProps = ComponentPropsWithoutRef<typeof NativeImage>
export type FileInputProps = {
    text?: string;
    uploadIcon?: NativeImageProps['source'] & {
        priority?: keyof typeof FastImage.priority
    };
    styles?: StylesOf<FileInputComposition>;
}

export const FileInput: React.FC<FileInputProps> = ({
    uploadIcon, text
}) => {
    const [file, setFile] = React.useState(null)

    const openPickerFile = async () => {
        try {
            const file = await DocumentPicker.pick()
            setFile(file)
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                console.log('User cancelled the picker.')
            } else {
                throw err
            }
        }
    }

    return (
        <Touchable onPress={() => openPickerFile()} >
            {uploadIcon ? <Image source={uploadIcon} fast /> : null}
            <Text text={file[0].name || text} />
        </Touchable>
    )
}