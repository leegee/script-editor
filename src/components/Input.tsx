import './Input.scss';
import { Component, JSX } from 'solid-js';

interface TextInputProps extends Omit<JSX.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>, 'value'> {
    as?: 'input' | 'textarea';
    value?: (() => string | string[] | number);
    placeholder?: string;
}

const TextInput: Component<TextInputProps> = (props) => {
    const { as = 'input', value, ...rest } = props;
    if (typeof value !== 'function') {
        throw new TypeError('.value should be a getter: value()');
    }

    const isEmpty = () => {
        const val = value();
        return typeof val === 'string' && val.length === 0;
    };

    const rv = as === 'textarea'
        ? <textarea classList={{ empty: isEmpty() }} value={value()} {...(rest as JSX.TextareaHTMLAttributes<HTMLTextAreaElement>)} />
        : <input placeholder={rest.placeholder ?? ''} classList={{ empty: isEmpty() }} value={value()} {...(rest as JSX.InputHTMLAttributes<HTMLInputElement>)} />;

    return rv;
};

export default TextInput;
