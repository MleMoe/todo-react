const TEXT = Symbol('VDOM_TEXT');
const PROPS = ['className', 'htmlFor', 'value', 'checked'];
const EVENT_MAP = {
  onDoubleClick: 'ondblclick'
}

function findChildIndexBy(children, key, value, ignore) {
  return children.findIndex(
    (child, index) => !ignore.includes(index) && child?.[key] === value
  );
}

function diffChildren(node, newNode) {
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
        mount(newChild);
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

export function diff(node, newNode, parentNode) {
  if (node && newNode) {
    if (node.type === newNode.type) {
      if (node.type === TEXT) {
        if (node.text !== newNode.text) {
          node.domNode.textContent = newNode.text;
        }
      } else {
        diffProps(node, newNode);
        diffChildren(node, newNode);
      }
      newNode.domNode = node.domNode;
    } else {
      node.domNode.parentNode.replaceChild(newNode.domNode, mount(newNode));
    }
  } else if (node && !newNode) {
    node.domNode.parentNode.removeChild(node.domNode);
  } else if (!node && newNode) {
    parentNode && parentNode.domNode.appendChild(mount(newNode));
  }

  if (node) {
    delete node.domNode;
  }
}

// 知识点：reduce
export function createElement(type, allProps, ...allChildren) {
  const { key, ...props } = allProps || {};
  const element = { type, props };

  element.children = allChildren.reduce((prev, child) => {
    child = Array.isArray(child) ? child : [child];
    return prev.concat(
      child.map((c) =>
        c != null && !c.type
          ? {
              type: TEXT,
              text: c.toString(),
            }
          : c
      )
    );
  }, []);

  key != null && (element.key = key);

  return element;
}

function setProp(node, prop, val, remove) {
  if (/^on[A-Z]/.test(prop)) {
    node[EVENT_MAP[prop] || prop.toLowerCase()] = val;
  } else if (PROPS.includes(prop)) {
    node[prop] = val;
  } else {
    node[remove ? 'removeAttribute' : 'setAttribute'](prop, val);
  }
}

export function mount(vdom, parentNode) {
  let domNode;

  if (vdom) {
    const { type, text, props, children } = vdom;
    if (type === TEXT) {
      domNode = document.createTextNode(text);
    } else {
      domNode = document.createElement(type);
      props &&
        Object.keys(props).forEach((prop) =>
          setProp(domNode, prop, props[prop])
        );
      children.forEach((child) => mount(child, domNode));
    }
    vdom.domNode = domNode;
    parentNode && parentNode.appendChild(domNode);
  }

  return domNode;
}
