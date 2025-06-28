import { type Component, createSignal, JSX } from 'solid-js';
import CardHeader from './card/CardHeader';

interface CardProps {
    title?: string | JSX.Element;
    link?: string;
    label?: string;
    summary?: boolean;
    initialOpen?: boolean;
    onToggle?: (isOpen: boolean) => void;
    class?: string;
    children: JSX.Element;
    headerChildren?: JSX.Element;
}

const Card: Component<CardProps> = (props) => {
    const [isOpen, setIsOpen] = createSignal(!!props.initialOpen);

    const toggleOpen = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        const newOpen = !isOpen();
        setIsOpen(newOpen);
        props.onToggle?.(newOpen);
    };

    return (
        <section
            class={`card ${props.class ?? ''} ${isOpen() ? 'open' : ''} ${props.summary ? 'summary' : ''}`}
            tabIndex={0}
            aria-expanded={isOpen()}
            role="region"
            aria-label={props.label}
        >
            {props.title && (
                <CardHeader
                    class={props.class}
                    title={props.title}
                    link={props.link}
                    label={props.label}
                    toggleOpen={props.summary ? toggleOpen : undefined}
                />
            )}
            {isOpen() && <div class="card-content">{props.children}</div>}
        </section>
    );
};

export default Card;
