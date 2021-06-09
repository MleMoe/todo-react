import $ from 'jquery';
import App from './App';

function render(component, container) {
  $(container).append(component);
}

render(new App({
  cacheKey: 'todo-app-dom-diff'
}).mount(), document.body);