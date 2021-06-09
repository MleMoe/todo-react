export const TEXT = Symbol('VDOM_TEXT');
export const FRAGMENT = Symbol('VDOM_FRAGMENT');
export const PROPS = ['className', 'htmlFor', 'value', 'checked'];
export const EVENT_MAP = { onDoubleClick: 'ondblclick' };

export const MEMO = { memo: true };
export const EFFECT = { effect: true };
export const LAYOUT_EFFECT = { layoutEffect: true };