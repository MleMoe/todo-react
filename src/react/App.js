import cx from 'classnames';
import createStore from '@/common/store';
import { createElement, Component } from 'react';
import PropTypes from 'prop-types';
import '@/common/base.css';

// 优点
// 1. 数据与模板绑定，数据更新则同步到UI，无需过多 dom 操作
// 2. 可以直接在 jsx 里绑定事件
// 3. 可以保留一些状态，如输入框的内容等
// 4. 不依赖 jQuery 等库
// 5. 解决 autoFocus 等问题

// 思考题
// 1. virtual-dom 真的比 dom 操作要快吗？
// 2. diffChildren 有没有更好的算法
// 3. vue 实现数据和UI同步的原理是什么

export default class App extends Component {

  static propTypes = {
    cacheKey: PropTypes.string
  };

  constructor(props = {}) {
    super(props);
    this.store = createStore(this.props.cacheKey, (action) => {
      const { type, ...payload } = action;
      console.log(type, payload);
      this.setState({
        ...this.store.state
      });
    });
  }

  onAdd = (e) => {
    if (e.key === 'Enter') {
      const text = e.currentTarget.value;
      const input = e.currentTarget;
      this.store.add(text);
      input.value = '';
      input.focus();
    }
  };

  onRemove = (id) => {
    this.store.remove(id);
  };

  onToggle = (id) => {
    this.store.toggle(id);
  };

  onEdit = (e) => {
    const item = e.currentTarget.parentNode.parentNode;
    const input = item.querySelector('.edit');
    const value = input.value;
    item.classList.add('editing');
    input.value = '';
    input.focus();
    input.value = value;
  };

  onUpdate = (e, id) => {
    const item = e.currentTarget.parentNode;
    item.classList.remove('editing');
    this.store.update(id, e.currentTarget.value);
  };

  onToggleAll = () => {
    this.store.toggleAll();
  };

  onClear = () => {
    this.store.toggleAll(false);
  };

  onFilter = (type) => {
    this.store.filter(type);
  };

  render() {
    const { state, filteredList, leftCount } = this.store;
    const { filterType, todoList } = state;

    // create
    return (
      <section className="todoapp">
        <header className="header">
          <h1>todos</h1>
          <input
            className="new-todo"
            placeholder="What needs to be done?"
            autoFocus
            onKeyUp={this.onAdd}
          />
        </header>
        <section
          className={cx({
            main: true,
            hidden: !todoList.length,
          })}
        >
          <input
            id="toggle-all"
            className="toggle-all"
            checked={!(!todoList.length || leftCount)}
            type="checkbox"
            onChange={this.onToggleAll}
          />
          <label htmlFor="toggle-all">Mark all as complete</label>
          <ul className="todo-list">
            {filteredList.map(({ id, text, done }) => {
              return (
                <li data-id={id} key={id} className={cx({ completed: done })}>
                  <div className="view">
                    <input className="toggle" checked={done} type="checkbox" onChange={() => this.onToggle(id)} />
                    <label onDoubleClick={this.onEdit}>{text}</label>
                    <button className="destroy" onClick={() => this.onRemove(id)}></button>
                  </div>
                  <input className="edit" defaultValue={text} onBlur={(e) => this.onUpdate(e, id)} />
                </li>
              );
            })}
          </ul>
          <footer className="footer">
            <span className="todo-count">
              <strong>{leftCount}</strong> items left
            </span>
            <ul className="filters">
              <li>
                <a href="#/" className={cx({ selected: filterType === '' })} onClick={() => this.onFilter('')}>
                  All
                </a>
              </li>
              <li>
                <a
                  href="#/active"
                  className={cx({ selected: filterType === 'active' })}
                  onClick={() => this.onFilter('active')}
                >
                  Active
                </a>
              </li>
              <li>
                <a
                  href="#/completed"
                  className={cx({ selected: filterType === 'completed' })}
                  onClick={() => this.onFilter('completed')}
                >
                  Completed
                </a>
              </li>
            </ul>
            <button
              className={cx({
                'clear-completed': true,
                hidden: todoList.length === leftCount,
              })}
              onClick={this.onClear}
            >
              Clear completed
            </button>
          </footer>
        </section>
      </section>
    );
  }
}
