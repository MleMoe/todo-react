import { createElement, Fragment, Component } from '../react';
import Todo from './Todo';

export default class Footer extends Component {

  render() {
    const { items, selectAll, onEdit, onToggle, onRemove, onUpdate, onToggleAll } = this.props;

    return (
      <div>
        <input
          id="toggle-all"
          className="toggle-all"
          checked={selectAll}
          type="checkbox"
          onChange={onToggleAll}
        />
        <label htmlFor="toggle-all">Mark all as complete</label>
        <ul className="todo-list">
          {items.map(({ id, text, done }) => (
            <Todo
              id={id}
              key={id}
              text={text}
              done={done}
              onEdit={onEdit}
              onToggle={onToggle}
              onUpdate={onUpdate}
              onRemove={onRemove}
            />
          ))}
        </ul>
      </div>
    );
  }
}
