import {
  addTodo,
  findTodo,
  removeTodo,
  updateTodo,
  toggleTodoList,
  isChanged,
  loadState,
  saveState,
} from './utils';

// 知识点：单例模式
// get 的妙用
// reduce
export default function createStore(cacheKey, onChange) {
  return {
    cacheKey,

    state: (cacheKey && loadState(cacheKey)) || {
      filterType: '',
      todoList: [],
    },

    get filteredList() {
      return this.state.todoList.filter((todo) => {
        switch (this.state.filterType) {
          case 'active':
            return !todo.done;
          case 'completed':
            return todo.done;
          default:
            return true;
        }
      });
    },

    get leftCount() {
      return this.state.todoList.reduce((prev, todo) => {
        return prev + (todo.done ? 0 : 1);
      }, 0);
    },

    setState(newState) {
      if (isChanged(this.state, newState)) {
        Object.assign(this.state, newState);
        this.save();
      }
    },

    dispatch(type, payload) {
      onChange && onChange({
        type,
        ...payload
      });
    },

    save() {
      cacheKey && saveState(cacheKey, this.state);
    },

    find(id) {
      return findTodo(this.state.todoList, id);
    },

    findFiltered(id) {
      return findTodo(this.filteredList, id);
    },

    add(text) {
      if (!text) return;
      this.setState({
        todoList: addTodo(this.state.todoList, text),
      });
      const todo = this.state.todoList[this.state.todoList.length - 1];
      this.dispatch('add', todo);
    },

    remove(id) {
      this.setState({
        todoList: removeTodo(this.state.todoList, id),
      });
      this.dispatch('remove', { id });
    },

    update(id, text) {
      this.setState({
        todoList: updateTodo(this.state.todoList, id, { text }),
      });
      this.dispatch('update', { id, text });
    },

    toggle(id) {
      const done = !findTodo(this.state.todoList, id).done;
      this.setState({
        todoList: updateTodo(this.state.todoList, id, { done }),
      });
      this.dispatch('toggle', { id, done });
    },

    toggleAll(allDone) {
      const done = typeof allDone === 'boolean' ? allDone : !!this.leftCount;
      this.setState({
        todoList: toggleTodoList(this.state.todoList, done),
      });
      this.dispatch('toggleAll', { done });
    },

    filter(filterType) {
      this.setState({ filterType });
      this.dispatch('filter', { filterType });
    },
  };
}
