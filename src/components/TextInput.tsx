import './TextInput.scss';
import { Component, JSX } from 'solid-js';

export type InputTypesEnum = 'input' | 'textarea' | 'color' | 'url' | 'number';

interface TextInputProps extends Omit<JSX.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>, 'value'> {
    as?: InputTypesEnum;
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
        ? <textarea class='custom-input' classList={{ empty: isEmpty() }} value={value()} {...(rest as JSX.TextareaHTMLAttributes<HTMLTextAreaElement>)} />
        : <input class='custom-input' type={as} placeholder={rest.placeholder ?? ''} classList={{ empty: isEmpty() }} value={value()} {...(rest as JSX.InputHTMLAttributes<HTMLInputElement>)} />;

    return rv;
};

export default TextInput;
