/** @jsx jsx */
import { AnyFunction, ComponentVariants, IconPlaceholder, ModalComposition, ModalStyles, useComponentStyle } from '@codeleap/common';
import { jsx } from '@emotion/react';
import { ReactNode, useEffect, useLayoutEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { v4 } from 'uuid';
import { StylesOf } from '../types/utility';
import {Button} from './Button'
import {View} from './View'
import {Text} from './Text'


export type ModalProps = {
  
  open: boolean;
  title?: React.ReactNode;
  toggle: AnyFunction;
  styles?: StylesOf<ModalComposition>
  accessible?:boolean
  showClose?: boolean
  footer?: ReactNode
} & ComponentVariants<typeof ModalStyles> 



function focusModal(event: FocusEvent, id: string) {
  event.preventDefault();
  const modal = document.getElementById(id);
  if (modal) {
    modal.focus();
  }
}
export const ModalContent: React.FC<ModalProps & { id: string }> = (modalProps) => {
  const { children, open, title, toggle, id, responsiveVariants, variants, styles, showClose, footer, ...props } = modalProps
  
  const variantStyles = useComponentStyle('Modal', {
    responsiveVariants,
    variants,
    styles,
  })

  function closeOnEscPress(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Escape') {
      toggle();
    }
  }

  useLayoutEffect(() => {
    const modal = document.getElementById(id);
    if (modal) {
      modal.focus();
    }
  }, [id]);

  return (
    <View  aria-hidden={!open} className={open ? 'visible' : ''} style={variantStyles.wrapper}>
      <View  className='overlay' onClick={toggle} style={variantStyles.overlay}></View >
      <View
        component='section'
        className='content'
        style={variantStyles.box}
        onKeyDown={closeOnEscPress}
        tabIndex={0}
        id={id}
        aria-modal={true}
        role='dialog'
        aria-describedby={`${id}-title`}
        aria-label='Close the modal by presing Escape key'
        {...props}
      >
        {title &&  (
          <View component='header' className='modal-header header' id={`${id}-title`} style={variantStyles.header}>
            {typeof title === 'string' ? <Text text={title}/> : title}
            {
              showClose &&
            <Button rightIcon={'close' as IconPlaceholder} variants={['icon']} onPress={toggle}/>
            }
          </View>
        )}
        <View style={variantStyles.body}>
          {children}
        </View>
        {
          footer && <View component='footer' style={variantStyles.footer}> 
            {footer}
          </View>
        }
      </View>
    </View>
  );
};

export const Modal: React.FC<ModalProps> = ({accessible, ...props}) => {
  const modalId = useRef(v4());

  useEffect(() => {
    if (accessible){

      const currentId = modalId.current;
      const appRoot = document.body;
      appRoot.addEventListener('focusin', (e) => focusModal(e, currentId));
      return () => appRoot.removeEventListener('focusin', (e) => focusModal(e, currentId));
    }
  }, []);

  useEffect(() => {
    if (accessible){

      const appRoot = document.body;
      appRoot.setAttribute('aria-hidden', `${props.open}`);
      appRoot.setAttribute('tabindex', `${-1}`);
    }
  }, [props.open]);

  if (accessible){
    if (props.open) {
      document.body.style.overflow = 'hidden';
      return ReactDOM.createPortal(<ModalContent {...props} id={modalId.current} />, document.body);
    } else {
      document.body.style.overflow = 'visible';
      return null;
    }
  }

  return <ModalContent {...props} id={modalId.current} />
};
