import { useEffect, useRef } from 'react';

/*

Implementation taken from:
https://blog.logrocket.com/how-to-get-previous-props-state-with-react-hooks/

The ref object will always return the same value held in ref.current, to change the value we have to explicitly set it.

IMPORTANT:
useEffect is only called after the component is rendered with the previous value.
In other words useEffect Hook is always triggered after the return statement of the parent component is evaluated

Only after the render is done is the ref object updated within useEffect.
This means the returned "ref.current" value always contains the previous value since
the useEffect call updating the ref only executes after the component from which the "usePrevious" hook was called has finished rendering.
*/

const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => { ref.current = value; });
  return ref.current;
};

export default usePrevious;
