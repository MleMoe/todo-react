import { TEXT, FRAGMENT } from './constants';
import { setProp } from './utils';
import mount from './mount';

function findChildIndexBy(children, key, value, ignore) {
  return children.findIndex(
    (child, index) => !ignore.includes(index) && child?.[key] === value
  );
}

function diffChildren(node, newNode, parentNode, updater) {
  const children = Array.from(node.children);
  const newChildren = Array.from(newNode.children);
  const newChildNodes = [];
  const updated = [];

  newChildren.forEach((newChild) => {
    const key = newChild?.key;
    const type = newChild?.type;

    if (key != null || type != null) {
      const index = findChildIndexBy(
        children,
        key != null ? 'key' : 'type',
        key != null ? key : type,
        updated
      );

      if (index > -1) {
        const child = children[index];
        updated.push(index);
        diff(child, newChild);
      } else {
        mount(newChild, parentNode, updater);
      }
      newChildNodes.push(newChild.domNode);
    }
  });

  children.forEach((child, index) => {
    if (!updated.includes(index)) {
      diff(child, null);
    }
  });

  newChildNodes.forEach((newChildNode, index) => {
    const domNode = node.domNode;
    const childNode = domNode.childNodes[index];
    if (childNode) {
      if (childNode !== newChildNode) {
        domNode.insertBefore(newChildNode, childNode);
      }
    } else {
      domNode.appendChild(newChildNode);
    }
  });

  // const max = Math.max(children.length, newChildren.length);
  // for (let i = 0; i < max; i++) {
  //   diff(children[i], newChildren[i], node);
  // }
}

function diffProps(node, newNode) {
  const props = Object.keys(node.props || {});
  const newProps = Object.keys(node.props || {});
  const allProps = Array.from(new Set([...props, ...newProps]));

  allProps.forEach((prop) => {
    if (prop === 'children') return;
    const hasProp = prop in node.props;
    const newHasProp = prop in newNode.props;
    const val = node.props[prop];
    const newVal = newNode.props[prop];

    if (hasProp && newHasProp) {
      if (val !== newVal) {
        setProp(node.domNode, prop, newVal);
      }
    } else if (hasProp && !newHasProp) {
      setProp(node.domNode, prop, undefined, true);
    } else if (!hasProp && newHasProp) {
      setProp(node.domNode, prop, newVal);
    }
  });
}

export default function diff(node, newNode, parentNode) {
  if (node && newNode) {
    if (node.type === newNode.type) {
      if (node.type === TEXT) {
        if (node.text !== newNode.text) {
          node.domNode.textContent = newNode.text;
        }
      } else {
        if (typeof node.type === 'string') {
          diffProps(node, newNode);
        } else if (node.type !== FRAGMENT) {
          newNode.instance = node.instance;
          newNode.instance.props = newNode.props;
          newNode.vdom = newNode.instance.render();
          diff(node.vdom, newNode.vdom, parentNode);
        } else {
          // TODO
        }
        diffChildren(node, newNode);
      }
      newNode.domNode = node.domNode;
      newNode.updater = node.updater;
    } else {
      node.domNode.parentNode.replaceChild(
        newNode.domNode,
        mount(node, node.domNode.parentNode, node.updater)
      );
    }
  } else if (node && !newNode) {
    node.domNode.parentNode.removeChild(node.domNode);
  } else if (!node && newNode) {
    parentNode && mount(newNode, parentNode.domNode, parentNode.updater);
  }

  if (node) {
    delete node.instance;
    delete node.domNode;
    delete node.updater;
    delete node.vdom;
  }
}