const PROPS = ['className', 'htmlFor', 'value', 'checked'];
const IGNORE_ATTRS = ['class', 'for', 'value', 'checked'];

// 知识点：Array.from
// 知识点：includes
// 知识点：数组去重
// 知识点：?. 的用法

function findChildIndexByKey(children, value, ignore) {
  return children.findIndex((child, index) => !ignore.includes(index) && child.dataset?.key === value);
}

function findChildIndexByType(children, value, ignore) {
  return children.findIndex((child, index) => !ignore.includes(index) && child.nodeName === value);
}

function diffChildren(node, newNode) {
  const children = Array.from(node.childNodes);
  const newChildren = Array.from(newNode.childNodes);
  const newChildNodes = [];
  const updated = [];

  newChildren.forEach((newChild) => {
    const key = newChild.dataset?.key;
    const type = newChild.nodeName;

    const index =
      key != null
        ? findChildIndexByKey(children, key, updated)
        : findChildIndexByType(children, type, updated);
    
    if (index > -1) {
      const child = children[index];
      updated.push(index);
      diff(child, newChild);
      newChildNodes.push(child);
    } else {
      newChildNodes.push(newChild);
    }
  });

  children.forEach((child, index) => {
    if (!updated.includes(index)) {
      diff(child, null);
    }
  });

  newChildNodes.forEach((newChild, index) => {
    const child = node.childNodes[index];
    if (child) {
      if (child !== newChild) {
        node.insertBefore(newChild, child);
      }
    } else {
      node.appendChild(newChild);
    }
  });

  // const max = Math.max(children.length, newChildren.length);
  // for (let i = 0; i < max; i++) {
  //   diff(children[i], newChildren[i], node);
  // }
}

function diffProps(node, newNode) {
  const props = node.getAttributeNames();
  const newProps = newNode.getAttributeNames();
  const allProps = Array.from(new Set([...props, ...newProps]));

  allProps.forEach((prop) => {
    if (IGNORE_ATTRS.includes(prop)) return;

    const hasProp = node.hasAttribute(prop);
    const newHasProp = newNode.hasAttribute(prop);
    const val = node.getAttribute(prop);
    const newVal = newNode.getAttribute(prop);

    if (hasProp && newHasProp) {
      if (val !== newVal) {
        node.setAttribute(prop, newVal);
      }
    } else if (hasProp && !newHasProp) {
      node.removeAttribute(prop);
    } else if (!hasProp && newHasProp) {
      node.setAttribute(prop, newVal);
    }
  });

  PROPS.forEach((prop) => {
    if (node[prop] !== newNode[prop]) {
      node[prop] = newNode[prop];
    }
  });
}

export function diff(node, newNode, parentNode) {
  if (node && newNode) {
    if (node.nodeName === newNode.nodeName) {
      if (node.nodeName === '#text') {
        if (node.textContent !== newNode.textContent) {
          node.textContent = newNode.textContent;
        }
      } else {
        diffProps(node, newNode);
        diffChildren(node, newNode);
      }
    } else {
      node.parentNode.replaceChild(newNode, node);
    }
  } else if (node && !newNode) {
    node.parentNode.removeChild(node);
  } else if (!node && newNode) {
    parentNode && parentNode.appendChild(newNode);
  }
}
