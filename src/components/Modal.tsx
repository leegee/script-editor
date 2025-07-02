import { type Component, JSX, Show } from 'solid-js';
import { Portal } from 'solid-js/web';

import './Modal.scss';

type ModalProps = {
    open: boolean;
    onClose: () => void;
    title: string;
    children: JSX.Element;
};

const Modal: Component<ModalProps> = (props) => {
    const handleSpuriousClicks = (e: MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <Show when={props.open}>
            <Portal>
                <div class="modal-overlay" onClick={props.onClose} />
                <div class="modal-content" onClick={handleSpuriousClicks}>
                    <button class="modal-close" onClick={props.onClose}>×</button>
                    <h2>{props.title}</h2>
                    {props.children}
                </div>
            </Portal>
        </Show>
    );
};

export default Modal;
