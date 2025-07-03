import './Card.scss';
import { createSignal, JSX } from 'solid-js';
import CardHeader from '../card/CardHeader';
import { type EntityMap } from '../../lib/types';

export interface CardProps<T extends keyof EntityMap> {
    title?: string | JSX.Element;
    link?: string;
    label?: string;
    summary?: boolean;
    open?: boolean;
    onToggle?: (isOpen: boolean) => void;
    class?: string;
    children: JSX.Element;
    headerChildren?: JSX.Element;
    menuItems?: JSX.Element;

    entityId: string;
    entityType: T;
    accepts?: T[];
}


const Card = <T extends keyof EntityMap>(props: CardProps<T>) => {
    const [isOpen, setIsOpen] = createSignal(props.open || !props.summary);

    const toggleOpen = (e: Event) => {
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
            return;
        }
        e.preventDefault();
        e.stopPropagation();
        const newOpen = !isOpen();
        setIsOpen(newOpen);
        props.onToggle?.(newOpen);
    };

    return (
        <section
            class={`card ${props.class ?? ''} ${isOpen() ? 'open' : 'closed'} ${props.summary ? 'summary' : ''}`}
            tabIndex={0}
            aria-expanded={isOpen()}
            role="region"
            aria-label={props.label}
        >
            {props.title && (
                <CardHeader
                    title={props.title}
                    link={props.link}
                    label={props.label}
                    toggleOpen={props.summary ? toggleOpen : toggleOpen} // hmm
                    menuItems=<>{props.menuItems}</>
                />
            )}
            {isOpen() && <div class="card-content">{props.children}</div>}
        </section>
    );
};

export default Card;
