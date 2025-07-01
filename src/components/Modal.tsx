// components/Modal.tsx
import { type Component, JSX, Show } from 'solid-js';
import './Modal.scss';

type ModalProps = {
    open: boolean;
    onClose: () => void;
    children: JSX.Element;
};

const Modal: Component<ModalProps> = (props) => {
    return (
        <Show when={props.open}>
            <div class="modal-overlay" onClick={props.onClose} />
            <div class="modal-content">
                <button class="modal-close" onClick={props.onClose}>×</button>
                {props.children}
            </div>
        </Show>
    );
};

export default Modal;
