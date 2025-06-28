import './CardHeader.scss';
import { Component, Show, JSX } from 'solid-js';
import { A } from '@solidjs/router';
import Find from '../icons/Find';

interface CharacterHeaderProps {
  title: string;
  link?: string;
  label: string;
  class: string;
  children?: JSX.Element | JSX.Element[]
  toggleOpen: (e: Event) => void;
}

const CardHeader: Component<CharacterHeaderProps> = (props) => {
  const onKeyDown: JSX.EventHandler<HTMLElement, KeyboardEvent> = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      props.toggleOpen(e);
    }
  };

  return (
    <header
      role="button"
      tabIndex={0}
      onClick={props.toggleOpen}
      onKeyDown={onKeyDown}
      class={props.class}
    >
      {props.children && props.children}

      <h3 class="name">
        <span>{props.title}</span>

        <Show when={props.link}>
          <A
            href={props.link}
            class="details-link"
            aria-label={props.label}
            onClick={e => e.stopPropagation()}
          >
            <Find />
          </A>
        </Show>
      </h3>
    </header>
  );
};

export default CardHeader;
