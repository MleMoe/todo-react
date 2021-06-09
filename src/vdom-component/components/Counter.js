import { createElement, useReducer } from '../react';

export default function Counter() {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case 'decrement':
        return { ...state, count: state.count - 1 };
      case 'increment':
        return { ...state, count: state.count + 1 };
      default:
        throw new Error('dispatch unexist type');
    }
  }, { count: 0 });

  return (
    <div>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <strong>{state.count}</strong>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
    </div>
  )
}