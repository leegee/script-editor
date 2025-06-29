import './CardHeader.scss';

import { Component, Show, JSX } from 'solid-js';
import { A } from '@solidjs/router';
import DetailsLink from '../icons/Details';

interface CharacterHeaderProps {
  title: string | JSX.Element;
  link?: string;
  label: string;
  class: string;
  toggleOpen: (e: Event) => void;
}

const CardHeader: Component<CharacterHeaderProps> = (props) => {
  const onKeyDown: JSX.EventHandler<HTMLElement, KeyboardEvent> = (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      return;
    }
    if (e.key === 'Enter' || e.key === 'Escape') {
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
    >
      <h3>
        {props.title}
      </h3>

      <Show when={props.link}>
        <A
          href={props.link}
          class="details-link"
          aria-label={props.label}
          onClick={e => e.stopPropagation()}
        >
          <DetailsLink />
        </A>
      </Show>
    </header>
  );
};

export default CardHeader;
