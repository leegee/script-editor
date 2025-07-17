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
    parentType: string;
}

interface NonDraggableCardProps<T extends keyof EntityMap> extends BaseCardProps<T> {
    draggable: false;
    parentId?: string;
    parentType?: string;
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
        onDragStart: (e: DragEvent) => DragDropHandler.onDragStart(
            e,
            props.parentType ?? '', props.parentId,
            props.entityType ?? '', props.entityId,
        ),
        onDragOver: (e: DragEvent) => DragDropHandler.onDragOver(e, e.currentTarget as HTMLElement),
        onDrop: (e: DragEvent) => DragDropHandler.onDrop(e, e.currentTarget as HTMLElement, props.refresh ?? (() => { })),
        onDragEnd: DragDropHandler.onDragEnd,
    } : {};

    return (
        <section
            class={`card ${props.class ?? ''} ${isOpen() ? 'open' : 'closed'} ${props.summary ? 'summary' : ''}`}
            data-entity-type={props.entityType}
            data-entity-id={props.entityId}
            data-parent-type={props.parentType}
            data-parent-id={props.parentId}
            tabIndex={0}
            role="region"
            aria-expanded={isOpen()}
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