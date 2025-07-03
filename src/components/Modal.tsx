import { type Component, createEffect, JSX, Show } from 'solid-js';
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

    createEffect(() => {
        console.log('prop open', props.open)
    })

    return (
        <Show when={props.open}>
            <Portal>
                <div>
                    <div class="modal-overlay" onClick={props.onClose} />
                    <div class="modal-content" onClick={handleSpuriousClicks}>
                        <button class="modal-close" onClick={props.onClose}>×</button>
                        <h2>{props.title}</h2>
                        {props.children}
                    </div>
                </div>
            </Portal>
        </Show>
    );
};

export default Modal;
