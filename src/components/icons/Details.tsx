import { Component } from 'solid-js';

const MagnifyingGlassIcon: Component<{ size?: number; color?: string }> = (props) => {
    const size = props.size ?? 16;
    const color = props.color ?? 'currentColor';

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            fill="none"
            stroke={color}
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            viewBox="0 0 24 24"
            aria-hidden="true"
            role="img"
        >
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
    );
};

export default MagnifyingGlassIcon;
