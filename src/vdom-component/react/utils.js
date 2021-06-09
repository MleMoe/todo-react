import { PROPS, EVENT_MAP } from './constants';

export const rAF = (window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function (callback) {
    return window.setTimeout(callback, 1000 / 60);
  }).bind(window);

export function isString(str) {
  return typeof str === 'string';
}

export function isFunction(func) {
  return typeof func === 'function';
}

export function isChanged(state, newState) {
  return newState
    ? !Object.keys(newState).every((k) => {
        return Object.is(newState[k], state[k]);
      })
    : false;
}

export function isDepsChanged(x, y) {
  if (x === undefined && y === undefined) {
    // undefined undefined
    return true;
  } else if (Object.is(x, y)) {
    // deps, deps
    return false;
  } else if (!x || !y || x.length !== y.length) {
    // undefined, [1]
    // [], [1]
    return true;
  } else {
    // [1, 2], [1, 3]
    let changed = false;
    x.some((dep, i) => (changed = !Object.is(dep, y[i])));
    return changed;
  }
}

export function setProp(node, prop, val, remove) {
  if (prop === 'children') {
    return;
  } else if (/^on[A-Z]/.test(prop)) {
    node[EVENT_MAP[prop] || prop.toLowerCase()] = val;
  } else if (PROPS.includes(prop)) {
    node[prop] = val;
  } else {
    node[remove ? 'removeAttribute' : 'setAttribute'](prop, val);
  }
}
