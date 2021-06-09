import { TEXT } from './constants';

export default function createElement(type, allProps, ...allChildren) {
  const { key, ...props } = allProps || {};
  const element = { type, props };

  element.children = props.children = allChildren.reduce((prev, child) => {
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