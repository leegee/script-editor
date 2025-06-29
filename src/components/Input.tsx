import './Input.scss';
import { Component, JSX } from 'solid-js';

interface TextInputProps extends Omit<JSX.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>, 'value'> {
    as?: 'input' | 'textarea';
    value?: (() => string | string[] | number);
}

const TextInput: Component<TextInputProps> = (props) => {
    const { as = 'input', value, ...rest } = props;

    const rv = as === 'textarea'
        ? <textarea value={props.value()} {...(rest as JSX.TextareaHTMLAttributes<HTMLTextAreaElement>)} />
        : <input value={props.value()} {...(rest as JSX.InputHTMLAttributes<HTMLInputElement>)} />;

    return rv;
};


export default TextInput;
