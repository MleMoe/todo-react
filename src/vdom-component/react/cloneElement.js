export default function cloneElement(element) {
  if (element == null) return element;
  const { key, type, props, children } = element;
  const clonedElement = { type, props };
  key != null && (clonedElement.key = key);
  clonedElement.children = props.children = children.map((child) =>
    cloneElement(child)
  );
  return clonedElement;
}