import './Input.scss';
import { Component, JSX } from 'solid-js';

interface TextInputProps extends Omit<JSX.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>, 'value'> {
    as?: 'input' | 'textarea';
    value?: (() => string | string[] | number);
}

const TextInput: Component<TextInputProps> = (props) => {
    const { as = 'input', value, ...rest } = props;

    const val = typeof value === 'function' ? value() : undefined;

    if (
        typeof val === 'undefined' ||
        (typeof val !== 'number' && val.length === 0)
    ) {
        rest.class = (rest.class || '') + ' empty';
    }

    const rv = as === 'textarea'
        ? <textarea value={val} {...(rest as JSX.TextareaHTMLAttributes<HTMLTextAreaElement>)} />
        : <input value={val} {...(rest as JSX.InputHTMLAttributes<HTMLInputElement>)} />;

    return rv;
};

export default TextInput;
