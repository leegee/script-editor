import './TextInput.scss';
import { Component, createEffect, JSX } from 'solid-js';

export type InputTypesEnum = 'text' | 'textarea' | 'color' | 'url' | 'number';

interface TextInputProps extends Omit<JSX.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>, 'value'> {
    as?: InputTypesEnum;
    value?: (() => string | string[] | number);
    placeholder?: string;
    tooltip?: string;
}

const TextInput: Component<TextInputProps> = (props) => {
    const { as = 'input', value, ...rest } = props;

    if (typeof value !== 'function') {
        throw new TypeError('.value should be a getter: value()');
    }

    let textareaRef: HTMLTextAreaElement | undefined;

    const isEmpty = () => {
        const val = value();
        return typeof val === 'string' && val.length === 0;
    };

    const adjustHeight = () => {
        if (textareaRef) {
            textareaRef.style.height = 'auto'; // Reset height to shrink if needed
            textareaRef.style.height = textareaRef.scrollHeight + 'px';
        }
    };

    createEffect(() => {
        if (as === 'textarea') {
            requestAnimationFrame(() => adjustHeight());
        }
    });

    const rv = as === 'textarea'
        ? (
            <textarea
                ref={el => textareaRef = el}
                title={props.tooltip || ''}
                class='custom-input'
                classList={{ empty: isEmpty() }}
                value={value()}
                {...(rest as JSX.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            />
        ) : (
            <input
                type={as}
                title={props.tooltip || ''}
                class='custom-input'
                classList={{ empty: isEmpty() }}
                value={value()}
                {...(rest as JSX.InputHTMLAttributes<HTMLInputElement>)}
            />
        );

    return rv;
};

export default TextInput;
