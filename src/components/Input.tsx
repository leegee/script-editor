import { Component, JSX } from 'solid-js';

interface TextInputProps extends JSX.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
    as?: 'input' | 'textarea';
}

const TextInput: Component<TextInputProps> = (props) => {
    const { as = 'input', ...rest } = props;

    return as === 'textarea'
        ? <textarea {...(rest as JSX.TextareaHTMLAttributes<HTMLTextAreaElement>)} />
        : <input {...(rest as JSX.InputHTMLAttributes<HTMLInputElement>)} />;
};

export default TextInput;
