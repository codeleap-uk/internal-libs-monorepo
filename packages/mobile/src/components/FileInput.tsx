import React, { ComponentPropsWithoutRef } from 'react'
import { Image as NativeImage } from 'react-native'
import { Text } from './Text'
import { Touchable } from './Touchable'
import { View, ViewProps } from './View'
import { Image } from './Image'
import DocumentPicker from 'react-native-document-picker'
import { FastImage } from '../modules/fastImage'
import { FileInputComposition } from '@codeleap/common'
import { StylesOf } from '../types/utility'

type NativeImageProps = ComponentPropsWithoutRef<typeof NativeImage>
export type FileInputProps = {
    variant: 'file' | 'image';
    text?: string;
    uploadIcon?: NativeImageProps['source'] & {
        priority?: keyof typeof FastImage.priority
    };
    styles?: StylesOf<FileInputComposition>;
}

export const FileInput: React.FC<FileInputProps> = ({
    variant, uploadIcon, text
}) => {
    const [file, setFile] = React.useState(null)

    const openPickerFile = async () => {
        try {
            const file = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            })
            setFile(file)
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                console.log('User cancelled the picker.')
            } else {
                throw err
            }
        }
    }

    // async function openPicker() {
    //     try {
    //         const image = await ImageCropPicker.openPicker(Settings.FEEDBACK_IMAGE_OPTIONS)
    //         setFile(image.path)
    //     } catch (error) {
    //         info('Error on image picker', { error })
    //     }
    // }

    if (variant === 'file') {
        return (
            <Touchable onPress={() => openPickerFile()} >
                {uploadIcon ? <Image source={uploadIcon} fast /> : null}
                <Text text={file || text} />
            </Touchable>
        )
    }

    // if (variant === 'image') {
    //     return (
    //         <Touchable debugName={`Select image from ${debugName}`} onPress={() => openPicker()} disabled={Boolean(displayPath)}>
    //             <View style={[styles.uploadButton, Boolean(displayPath) && styles.uploadButtonDisabled]}>
    //                 <Image source={upload} style={styles.uploadIcon} />
    //             </View>
    //         </Touchable>
    //     )
    // }
}