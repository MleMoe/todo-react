import { createElement, Component } from '../react';
import cx from 'classnames';

export default class Footer extends Component {

  render() {
    const { hideClear, leftCount, filterType, onClear, onFilter } = this.props;

    return (
      <footer className="footer">
        <span className="todo-count">
          <strong>{leftCount}</strong> items left
        </span>
        <ul className="filters">
          <li>
            <a
              href="#/"
              className={cx({ selected: filterType === '' })}
              onClick={() => onFilter('')}
            >
              All
            </a>
          </li>
          <li>
            <a
              href="#/active"
              className={cx({ selected: filterType === 'active' })}
              onClick={() => onFilter('active')}
            >
              Active
            </a>
          </li>
          <li>
            <a
              href="#/completed"
              className={cx({ selected: filterType === 'completed' })}
              onClick={() => onFilter('completed')}
            >
              Completed
            </a>
          </li>
        </ul>
        <button
          className={cx({
            'clear-completed': true,
            hidden: hideClear,
          })}
          onClick={onClear}
        >
          Clear completed
        </button>
      </footer>
    );
  }
}
