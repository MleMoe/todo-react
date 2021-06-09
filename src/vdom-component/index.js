import { createElement, render } from './react';
import App from './App';

render(<App cacheKey="todo-app-vdom" />, document.body);