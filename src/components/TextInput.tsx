import './TextInput.scss';
import { Component, createEffect, createSignal, JSX } from 'solid-js';

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

    const [textareaRef, setTextareaRef] = createSignal<HTMLTextAreaElement | null>(null);

    const isEmpty = () => {
        const val = value();
        return typeof val === 'string' && val.length === 0;
    };

    const adjustHeight = () => {
        const el = textareaRef();
        if (el) {
            el.style.height = 'auto';
            el.style.height = el.scrollHeight + 'px';
        }
    }

    const inputTextKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            (e.currentTarget as HTMLElement).blur()
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
                ref={setTextareaRef}
                title={props.tooltip || ''}
                class='custom-input'
                classList={{ empty: isEmpty() }}
                value={value()}
                onkeydown={adjustHeight}
                {...(rest as JSX.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            />
        ) : (
            <input
                type={as}
                title={props.tooltip || ''}
                class='custom-input'
                classList={{ empty: isEmpty() }}
                value={value()}
                onKeyDown={inputTextKeyDown}
                {...(rest as JSX.InputHTMLAttributes<HTMLInputElement>)}
            />
        );

    return rv;
};

export default TextInput;
