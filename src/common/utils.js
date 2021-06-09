import $ from 'jquery';

export function addTodo(todoList, text) {
  return [...todoList, { text, done: false, id: Date.now() }];
}

export function removeTodo(todoList, id) {
  return todoList.filter((todo) => id !== todo.id);
}

export function updateTodo(todoList, id, data) {
  return todoList.map((todo) =>
    id === todo.id
      ? {
          ...todo,
          ...data,
        }
      : todo
  );
}

export function findTodo(todoList, id) {
  return todoList.find(todo => id === todo.id);
}

export function toggleTodoList(todoList, done) {
  return todoList.map((todo) => ({ ...todo, done }));
}

export function toCamelCase(str) {
  return str.replace(/-(a-zA-Z)/g, ($0, $1) => $1.toUpperCase());
}

export function toDashedCase(str) {
  return str.replace(/[A-Z]/g, $0 => `-${$0.toLowerCase()}`);
}

export function getNodesByKeys(keys) {
  return keys.reduce((nodes, key) => {
    return {
      ...nodes,
      [key]: $(`.${toDashedCase(key)}`)
    }
  }, {});
}

export function loadState(cacheKey) {
  return JSON.parse(localStorage.getItem(cacheKey) || 'null') || undefined;
}

export function saveState(cacheKey, state) {
  return localStorage.setItem(cacheKey, JSON.stringify(state));
}

export function isChanged(state, newState) {
  return newState
    ? !Object.keys(newState).every((k) => {
        return Object.is(newState[k], state[k]);
      })
    : false;
}