import './CardHeader.scss';

import { Component, Show, JSX } from 'solid-js';
import { A } from '@solidjs/router';
// import DetailsLink from '../icons/Details';
import OverflowMenu from '../OverflowMenu';

interface CharacterHeaderProps {
  title: string | JSX.Element;
  link?: string;
  label: string;
  toggleOpen: (e: Event) => void;
}

const invalidClicktarget = (e) => {
  if (e.target.tagName === 'INPUT'
    || e.target.tagName === 'TEXTAREA'
    || e.target.tagName === 'BUTTON'
    || (e.target as HTMLElement).isContentEditable
  ) {
    return true;
  }
  return false;
};

const CardHeader: Component<CharacterHeaderProps> = (props) => {
  const onKeyDown: JSX.EventHandler<HTMLElement, KeyboardEvent> = (e) => {
    if (invalidClicktarget(e)) return;

    if (e.key === 'Enter' || e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      props.toggleOpen(e);
    }
  };

  const maybeToggleOpen = (e) => {
    if (invalidClicktarget(e)) return;
    e.preventDefault();
    e.stopPropagation();
    props.toggleOpen(e);
  }

  return (
    <header
      class='card-header'
      role="button"
      tabIndex={0}
      onClick={maybeToggleOpen}
      onKeyDown={onKeyDown}
    >
      <h3 class='card-title-text'>
        {props.title}
      </h3>

      <OverflowMenu>
        <Show when={props.link}>
          <button>
            <A
              href={props.link}
              // class="details-link"
              aria-label={props.label}
            // onClick={e => e.stopPropagation()}
            >
              Focus
            </A>
          </button>
          <button>Delete</button>
        </Show>
      </OverflowMenu>


    </header>
  );
};

export default CardHeader;
