import { createSignal, createEffect, splitProps, JSX } from 'solid-js';
import './Switch.scss';

type SwitchPropsType = {
    checked?: boolean;                // controlled checked state
    defaultChecked?: boolean;         // uncontrolled initial state
    onUpdate?: (checked: boolean) => void;
    disabled?: boolean;
    name?: string;
    class?: string;
} & JSX.HTMLAttributes<HTMLInputElement>;

/**
* @example 
* <CssSwitch
*   checked={someSignal()}
*   onUpdate={(checked) => console.log('switch:', checked)}
*   disabled={false}
* />
*
* Uncontrolled:
* 
* <CssSwitch defaultChecked={true} onUpdate={(c) => console.log(c)} />
* 
* @param props 
* @returns 
*/
export default function Swtich(props: SwitchPropsType) {
    const [local, rest] = splitProps(props, [
        'checked',
        'defaultChecked',
        'onUpdate',
        'disabled',
        'name',
        'class',
    ]);

    const [internalChecked, setInternalChecked] = createSignal(local.defaultChecked ?? false);

    const isControlled = typeof local.checked === 'boolean';

    createEffect(() => {
        if (isControlled) {
            setInternalChecked(local.checked!);
        }
    });

    function handleInput(e: InputEvent & { currentTarget: HTMLInputElement }) {
        const newChecked = e.currentTarget.checked;

        if (!isControlled) {
            setInternalChecked(newChecked);
        }

        local.onUpdate?.(newChecked);
    }

    return (
        <label class={`switch ${local.class ?? ''} ${local.disabled ? 'disabled' : ''}`}>
            <input
                type="checkbox"
                name={local.name}
                checked={internalChecked()}
                disabled={local.disabled}
                onInput={handleInput}
                {...rest}
            />
            <span class="slider"></span>
        </label>
    );
}
