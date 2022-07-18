import { NULL } from "../util";

/** 解构 */
export default function hasDeconstruction(
  target: any,
  key: string | symbol,
  defaultValue: NULL,
  CreateProxy: Function
): [boolean, any] {
  if (key !== Symbol.iterator) return [false, null];
  const handleIterator = {
    current: 0,
    length: 5,
    [Symbol.iterator]() {
      const hasIt = Array.isArray(target) || target[Symbol.iterator];
      return hasIt ? target : handleIterator;
    },
    next() {
      const targetIndex = handleIterator.current++;
      return {
        done: targetIndex === handleIterator.length,
        value: CreateProxy(defaultValue),
      };
    },
  };
  return [true, handleIterator[Symbol.iterator]];
}
