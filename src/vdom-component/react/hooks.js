import Dispatcher from './dispatcher';

const hooks = {};

function useHook(hook) {
  // lazy initial
  const hookFunc = function(...oArgs) {
    if (!hooks[hook]) {
      hooks[hook] = (...args) => {
        if (Dispatcher.current) {
          return Dispatcher.current[hook].apply(Dispatcher.current, args);
        } else {
          throw new Error(`[HOOKS_POLYFILL_ERROR]: You can not use "${hook}" outside of the function.`);
        }
      };
    }
    return hooks[hook](...oArgs);
  };
  hookFunc.displayName = hook;
  return hookFunc;
}

export const useState = useHook('useState');
export const useReducer = useHook('useReducer');
export const useContext = useHook('useContext');
export const useMemo = useHook('useMemo');
export const useCallback = useHook('useCallback');
export const useEffect = useHook('useEffect');
export const useLayoutEffect = useHook('useLayoutEffect');
export const useRef = useHook('useRef');
export const useImperativeHandle = useHook('useImperativeHandle');
export function useDebugValue() {} // TODO empty fun