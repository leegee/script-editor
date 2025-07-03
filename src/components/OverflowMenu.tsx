import './OverflowMenu.scss';
import { createSignal, onCleanup, JSX, Show } from 'solid-js';

interface OverflowMenuProps {
    class?: string;
    buttonContent?: JSX.Element;
    children: JSX.Element;
}

const OverflowMenu = (props: OverflowMenuProps) => {
    const [open, setOpen] = createSignal(false);

    let menuRef: HTMLElement | undefined;
    let openerButtonRef: HTMLButtonElement | undefined;

    const onDocumentClick = (e: MouseEvent) => {
        if (menuRef && openerButtonRef) {
            setOpen(false);
            document.removeEventListener('click', onDocumentClick);
        }
    };

    const toggleMenu = () => {
        const willOpen = !open();
        setOpen(willOpen);
        if (willOpen) {
            document.addEventListener('click', onDocumentClick);
        } else {
            document.removeEventListener('click', onDocumentClick);
        }
    };

    onCleanup(() => {
        document.removeEventListener('click', onDocumentClick);
    });

    return (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            <button
                ref={openerButtonRef}
                type="button"
                aria-haspopup="true"
                aria-expanded={open()}
                onClick={toggleMenu}
                class={` ${props.class ? props.class : 'overflow-menu-button'}`}
            >
                {props.buttonContent ?? '⋮'}
            </button>

            {open() && (
                <nav ref={menuRef} class="overflow-menu-content">
                    {props.children}
                </nav>
            )}
        </div>
    );
};

export default OverflowMenu;
