import { createElement } from '../react';

export default function Header({
  onAdd
}) {
  return (
    <header className="header">
      <h1>todos</h1>
      <input
        className="new-todo"
        placeholder="What needs to be done?"
        autoFocus
        onKeyUp={onAdd}
      />
    </header>
  );
}
