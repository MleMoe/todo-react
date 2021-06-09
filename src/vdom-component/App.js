import cx from 'classnames';
import createStore from '@/common/store';
import { createElement, Component } from './react';
import TodoList from './components/TodoList';
import Header from './components/Header';
import Footer from './components/Footer';
import Counter from './components/Counter';
import '@/common/base.css';

// 优点
// 1. 数据与模板绑定，数据更新则同步到UI，无需过多 dom 操作
// 2. 可以直接在 jsx 里绑定事件
// 3. 可以保留一些状态，如输入框的内容等
// 4. 不依赖 jQuery 等库

export default class App extends Component {
  constructor(props) {
    super(props);
    this.store = createStore(this.props.cacheKey, (action) => {
      const { type, ...payload } = action;
      console.log(type, payload);
      this.setState({ ...this.store.state });
    });
    this.state = { ...this.store.state };
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
        <Counter />
        <Header onAdd={this.onAdd} />
        <section
          className={cx({
            main: true,
            hidden: !todoList.length,
          })}
        >
          <TodoList
            items={filteredList}
            selectAll={!(!todoList.length || leftCount)}
            onEdit={this.onEdit}
            onToggle={this.onToggle}
            onUpdate={this.onUpdate}
            onRemove={this.onRemove}
            onToggleAll={this.onToggleAll}
          />
          <Footer
            leftCount={leftCount}
            filterType={filterType}
            hideClear={todoList.length === leftCount}
            onClear={this.onClear}
            onFilter={this.onFilter}
          />
        </section>
      </section>
    );
  }
}
