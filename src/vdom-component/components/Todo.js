import { createElement } from '../react';
import cx from 'classnames';

export default function Todo({
  id,
  text,
  done,
  onEdit,
  onToggle,
  onRemove,
  onUpdate,
}) {
  return (
    <li data-id={id} className={cx({ completed: done })}>
      <div className="view">
        <input
          className="toggle"
          checked={done}
          type="checkbox"
          onChange={() => onToggle(id)}
        />
        <label onDoubleClick={onEdit}>{text}</label>
        <button className="destroy" onClick={() => onRemove(id)}></button>
      </div>
      <input className="edit" value={text} onBlur={() => onUpdate(id)} />
    </li>
  );
}
