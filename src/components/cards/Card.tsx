import './Card.scss';
import { createSignal, JSX } from 'solid-js';
import CardHeader from '../card/CardHeader';
import { type EntityMap } from '../../lib/types';
import { DragDropHandler } from '../../lib/DragDropHandler';

interface BaseCardProps<T extends keyof EntityMap> {
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
    refresh?: () => void;
    entityType: T;
    entityId: string;
    accepts?: T[];
}

interface DraggableCardProps<T extends keyof EntityMap> extends BaseCardProps<T> {
    draggable?: true | undefined;
    parentId: string;
}

interface NonDraggableCardProps<T extends keyof EntityMap> extends BaseCardProps<T> {
    draggable: false;
    parentId?: string;
}

export type CardProps<T extends keyof EntityMap> = DraggableCardProps<T> | NonDraggableCardProps<T>;

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

    const dragProps = props.draggable !== false ? {
        draggable: true,
        onDragStart: (e: DragEvent) => DragDropHandler.onDragStart(e, props.entityId, props.class ?? ''),
        onDragOver: (e: DragEvent) => DragDropHandler.onDragOver(e, props.class ?? '', props.class ?? ''),
        onDrop: (e: DragEvent) => DragDropHandler.onDrop(e, props.entityId, props.parentId, props.refresh ?? (() => { }))
    } : {};

    if (!props.parentId) {
        console.log('no parentId in Card', props);
    }

    return (
        <section
            class={`card ${props.class ?? ''} ${isOpen() ? 'open' : 'closed'} ${props.summary ? 'summary' : ''}`}
            tabIndex={0}
            aria-expanded={isOpen()}
            role="region"
            aria-label={props.label}
            {...dragProps}
        >
            {props.title && (
                <CardHeader
                    title={props.title}
                    link={props.link}
                    label={props.label}
                    toggleOpen={props.summary ? toggleOpen : toggleOpen}
                    menuItems={<>{props.menuItems}</>}
                />
            )}
            {isOpen() && <div class="card-content">{props.children}</div>}
        </section>
    );
};

export default Card;