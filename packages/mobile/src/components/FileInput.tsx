import React, { forwardRef, useImperativeHandle, useRef } from 'react'
import { DocumentPicker } from '../modules/documentPicker'
import { ComponentVariants, FileInputComposition, FileInputStyles, IconPlaceholder, MobileInputFile, useComponentStyle, useStyle} from '@codeleap/common'
import { StylesOf } from '../types/utility'
import { Button } from './Button'
import { View } from './View'
import { InputLabel } from './TextInput'

export type FileInputRef = {
    openFilePicker: () => void
}

export type FileInputProps = {
    label?: string;
    iconName?: IconPlaceholder
    styles?: StylesOf<FileInputComposition>;
    mode: 'hidden' | 'button'
    variants?: ComponentVariants<typeof FileInputStyles>['variants']
    onFileSelect(files:MobileInputFile[]): void
}

export const FileInput: React.FC<FileInputProps> = forwardRef<FileInputRef, FileInputProps>((fileInputProps,ref) => {
    const {mode = 'hidden', onFileSelect, iconName, styles, label, variants} = fileInputProps
    
    const [file, setFile] = React.useState(null)

    const {logger} = useStyle() 
    
    const openFilePicker = async () => {
        try {
            let files = await DocumentPicker.pick()
            if(!Array.isArray(file)){
                files = [files]
            } 
            setFile(file)
            onFileSelect(files.map((file) => ({preview: file, file})))
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
               logger.log('User cancelled the picker.', null, 'Component')
            } else {
                throw err
            }
        }
    }
    
    const variantStyles = useComponentStyle('FileInput', {
        styles,
        variants,
        
    })


    useImperativeHandle(ref, () => ({
        openFilePicker
    }))

    if(mode === 'button'){
        return (<View style={variantStyles.wrapper}>
            <InputLabel label={label} style={variantStyles.label}/>
            <Button  onPress={() => openFilePicker()}  text={file?.[0]?.name || ''} icon={ iconName || 'fileInputButton' as IconPlaceholder} />
        </View>
        )
    }

    return null
})