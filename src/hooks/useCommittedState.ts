import { useCallback, useEffect, useRef, useState } from 'react';

export function useCommittedState<T>(createInitialValue: () => T) {
  const [state, setState] = useState<T>(createInitialValue);
  const stateRef = useRef(state);

  const commitState = useCallback((nextState: T) => {
    stateRef.current = nextState;
    setState(nextState);
  }, []);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  return { state, stateRef, commitState };
}
