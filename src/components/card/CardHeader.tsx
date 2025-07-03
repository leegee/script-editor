import './CardHeader.scss';

import { Component, Show, JSX, createEffect } from 'solid-js';
import { A, useNavigate } from '@solidjs/router';
import OverflowMenu from '../OverflowMenu';

interface CharacterHeaderProps {
  title: string | JSX.Element;
  link?: string;
  label: string;
  toggleOpen?: (e: Event) => void;
  menuItems?: JSX.Element | JSX.Element[]
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
  const navigate = useNavigate();

  const onKeyDown: JSX.EventHandler<HTMLElement, KeyboardEvent> = (e) => {
    if (!props.toggleOpen || invalidClicktarget(e)) return;

    if (e.key === 'Enter' || e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      props.toggleOpen(e);
    }
  };

  const maybeToggleOpen = (e) => {
    if (!props.toggleOpen || invalidClicktarget(e)) return;
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
        <Show when={props.link && typeof props.title === 'string'} fallback={props.title}>
          <button onclick={() => navigate(props.link)}>{props.title}</button>
        </Show>
        {/* {props.title} */}
      </h3>

      <OverflowMenu>
        <Show when={props.link}>
          <button onClick={() => navigate(props.link)} aria-label={props.label} >
            Focus
          </button>
        </Show>
        {props.menuItems}
      </OverflowMenu>


    </header >
  );
};

export default CardHeader;
