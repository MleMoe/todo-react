import App from './App';

function render(component, container) {
  container.appendChild(component);
}

render(new App({
  cacheKey: 'todo-app-vdom'
}).mount(), document.body);