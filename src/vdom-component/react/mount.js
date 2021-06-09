import { setProp } from './utils';
import { TEXT, FRAGMENT } from './constants';
import createInstance from './createInstance';
import RootComponent from './RootComponent';

export default function mount(vdom, parentNode, updater) {
  let domNode;

  if (vdom) {
    const { type, text, props, children } = vdom;
    if (type === TEXT) {
      domNode = document.createTextNode(text);
    } else if (type === FRAGMENT) {
      domNode = document.createDocumentFragment();
      children.forEach((child) => mount(child, domNode, updater));
    } else if (typeof type === 'string') {
      domNode = document.createElement(type);
      props &&
        Object.keys(props).forEach((prop) =>
          setProp(domNode, prop, props[prop])
        );
      children.forEach((child) => mount(child, domNode, updater));
    } else {
      vdom.instance = createInstance(type, props, updater);
      vdom.instance.__$updater = updater;
      vdom.vdom = vdom.instance.render();
      domNode = mount(vdom.vdom, parentNode, updater);
      type === RootComponent && updater.bind(vdom);
    }
    vdom.updater = updater;
    vdom.domNode = type === FRAGMENT ? parentNode : domNode; // TODO
    parentNode && parentNode.appendChild(domNode);
  }

  return domNode;
}