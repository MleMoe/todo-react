import { createElement } from 'react';
import { render } from 'react-dom';
import App from './App';

const root = document.createElement('div');
document.body.appendChild(root);
render(<App cacheKey="todo-app-react" />, root);