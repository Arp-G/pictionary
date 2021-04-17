import { useEffect, useRef } from 'react';

/*
Run some code on every subsequest dependency changes(dependencies specified in "deps") but don't run code on mount
This hook uses the "useRef" hook to keep track of initial mount of the component
*/

const useDidMount = (func, deps) => {
  const didMount = useRef(false);

  useEffect(() => {
    // Run code if its not the first render/mount
    if (didMount.current) func();
    else didMount.current = true;
  }, deps);
};

export default useDidMount;
