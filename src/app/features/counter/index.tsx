import { useState } from "react";

import { decrement, increment, incrementAsync, incrementByAmount, incrementIfOdd, selectCount } from "./counter-slice";

import { useAppDispatch, useAppSelector } from "../../hooks";

export function Counter() {
  const count = useAppSelector(selectCount);
  const dispatch = useAppDispatch();
  const [incrementAmount, setIncrementAmount] = useState("2");

  const incrementValue = Number(incrementAmount) || 0;

  return (
    <div>
      <div>
        <button type="button" onClick={() => dispatch(decrement())}>
          -
        </button>
        <span>{count}</span>
        <button type="button" onClick={() => dispatch(increment())}>
          +
        </button>
      </div>
      <div>
        <input value={incrementAmount} onChange={(e) => setIncrementAmount(e.target.value)} />
        <button type="button" onClick={() => dispatch(incrementByAmount(incrementValue))}>
          Add Amount
        </button>
        <button type="button" onClick={() => dispatch(incrementAsync(incrementValue))}>
          Add Async
        </button>
        <button type="button" onClick={() => dispatch(incrementIfOdd(incrementValue))}>
          Add If Odd
        </button>
      </div>
    </div>
  );
}
