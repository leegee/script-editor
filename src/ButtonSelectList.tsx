import "./ButtonSelectList.scss";

import { Show, createSignal, onCleanup, onMount } from 'solid-js';

type ButtonSelectListProps<T> = {
    options: T[];
    getLabel: (option: T) => string;
    onSelect: (option: T) => void;
    buttonLabel?: string;
};

export function ButtonSelectList<T>(props: ButtonSelectListProps<T>) {
    const [isOpen, setIsOpen] = createSignal(false);

    let containerRef: HTMLDivElement | undefined;

    const handleClickOutside = (event: MouseEvent) => {
        if (containerRef && !containerRef.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    onMount(() => {
        document.addEventListener('click', handleClickOutside);
    });

    onCleanup(() => {
        document.removeEventListener('click', handleClickOutside);
    });

    const handleSelect = (option: T) => {
        props.onSelect(option);
        setIsOpen(false);
    };

    return (
        <div class="button-select-list" ref={containerRef}>
            <button
                type="button"
                class="button-select-list__toggle"
                onClick={() => setIsOpen(!isOpen())}
                aria-expanded={isOpen()}
            >
                {props.buttonLabel || 'Select'}
            </button>

            <Show when={isOpen()}>
                <ul class="button-select-list__dropdown">
                    {props.options.map((option) => (
                        <li class="button-select-list__option">
                            <button
                                type="button"
                                onClick={() => handleSelect(option)}
                            >
                                {props.getLabel(option)}
                            </button>
                        </li>
                    ))}
                </ul>
            </Show>
        </div>
    );
}
