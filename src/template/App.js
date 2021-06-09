import $ from 'jquery';
import cx from 'classnames';
import createStore from '@/common/store';
import '@/common/base.css';

// 优点
// 1. 数据与模板绑定，数据更新则同步到UI，无需过多 dom 操作
// 2. 通过事件委托，可以轻松监听事件

// 缺点
// 1. 直接替换原节点，内容多的时候性能差！！！
// 2. 无法保留一些状态，如输入框的内容等
// 3. 事件回调只能通过 data-xxx 获取参数

export default class App {
  constructor(props = {}) {
    this.props = props;
    this.store = createStore(this.props.cacheKey, (action) => {
      const { type, ...payload } = action;
      console.log(type, payload);
      this.update(action);
    });
  }

  onAdd = (e) => {
    if (e.key === 'Enter') {
      const text = e.currentTarget.value;
      this.store.add(text);
      const input = this.node.find('.new-todo')[0];
      input.value = '';
      input.focus();
    }
  }

  onRemove = (e) => {
    const item = $(e.currentTarget).parents('li').eq(0);
    const id = Number(item.attr('data-id'));
    this.store.remove(id);
  }

  onToggle = (e) => {
    const item = $(e.currentTarget).parents('li').eq(0);
    const id = Number(item.attr('data-id'));
    this.store.toggle(id);
  }

  onEdit = (e) => {
    const item = $(e.currentTarget).parents('li').eq(0);
    const input = item.find('.edit')[0];
    const value = input.value;
    item.addClass('editing');
    input.value = '';
    input.focus();
    input.value = value;
  }

  onUpdate = (e) => {
    const item = $(e.currentTarget).parents('li').eq(0);
    const id = Number(item.attr('data-id'));
    item.removeClass('editing');
    this.store.update(id, e.currentTarget.value);
  }

  onToggleAll = () => {
    this.store.toggleAll();
  }

  onClear = () => {
    this.store.toggleAll(false);
  }

  onFilter = (e) => {
    const type = $(e.currentTarget).attr('href').replace(/^#\//, '');
    this.store.filter(type);
  }

  bindEvents() {
    this.node.on('keyup', '.new-todo', this.onAdd);
    this.node.on('click', 'li .destroy', this.onRemove);
    this.node.on('click', 'li .toggle', this.onToggle);
    this.node.on('dblclick', 'li label', this.onEdit);
    this.node.on('blur', 'li .edit', this.onUpdate);
    this.node.on('click', '.toggle-all', this.onToggleAll);
    this.node.on('click', '.clear-completed', this.onClear);
    this.node.on('click', '.filters a', this.onFilter);
  }

  mount() {
    this.node = $(this.render());
    this.bindEvents();
    setTimeout(() => this.node.find('.new-todo')[0].focus());
    return this.node;
  }

  update() {
    this.node.replaceWith(this.mount());
  }

  render() {
    const { state, filteredList, leftCount } = this.store;
    const { filterType, todoList } = state;

    // create
    return (`<section class="todoapp">
      <header class="header">
        <h1>todos</h1>
        <input class="new-todo" placeholder="What needs to be done?" autofocus />
      </header>
      <section class="${cx({
        main: true,
        hidden: !todoList.length
      })}">
        <input id="toggle-all" class="toggle-all" ${
          !todoList.length || leftCount ? '' : 'checked'
        } type="checkbox" />
        <label for="toggle-all">Mark all as complete</label>
        <ul class="todo-list">${filteredList.reduce(
          (items, { id, text, done }) => {
            return (
              items +
              `<li data-id="${id}" class="${cx({ completed: done })}">
            <div class="view">
              <input class="toggle" ${done ? 'checked' : ''} type="checkbox" />
              <label>${text}</label>
              <button class="destroy"></button>
            </div>
            <input class="edit" value="${text}" />
          </li>`
            );
          },
          ''
        )}</ul>
        <footer class="footer">
          <span class="todo-count"><strong>${leftCount}</strong> items left</span>
          <ul class="filters">
            <li>
              <a href="#/" class="${cx({ selected: filterType === '' })}">All</a>
            </li>
            <li>
              <a href="#/active" class="${cx({ selected: filterType === 'active' })}">Active</a>
            </li>
            <li>
              <a href="#/completed" class="${cx({ selected: filterType === 'completed' })}">Completed</a>
            </li>
          </ul>
          <button class="${cx({
            'clear-completed': true,
            hidden: todoList.length === leftCount
          })}">Clear completed</button>
        </footer>
      </section>
    </section>`);
  }
}
