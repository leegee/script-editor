import '../Avatar.scss';
import './LocationPinIcon.scss';

import { type Component } from 'solid-js';

const LocationPinIcon: Component<{ size?: number; color?: string }> = (props) => {
    const size = props.size ?? 16;
    const color = props.color ?? 'currentColor';

    return (
        <span class="avatar avatar-circle">
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
                <path d="M21 10c0 6-9 12-9 12S3 16 3 10a9 9 0 1 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
            </svg>
        </span>
    );
};

export default LocationPinIcon;
