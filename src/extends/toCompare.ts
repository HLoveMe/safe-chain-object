/**
 *  处理比较操作符 会调用父类
 * */

import { getThisOrSuperPro } from "../util";
import NullUndefined from "../wrapper";

export default function hasCompare(
  target: any,
  key: string | symbol
): [boolean, any] {
  const CompareHandle = {
    [Symbol.toPrimitive](type: string) {
      if (type === "default") {
        // ==
        console.log("%c createSafe()  操作符是被禁止的", "color: red;");
        return NaN;
      }
      if (type === "string") {
        if (NullUndefined.is(target)) {
          return `${(target as NullUndefined).value}_Wrapper`;
        }
        return `${(typeof target).toLocaleUpperCase()}_Wrapper`;
      }
      return target;
    },
    valueOf: () => NaN,
    toString: () => NaN,
  };
  const keys = [
    Symbol.toPrimitive,
    ...Object.keys(CompareHandle).sort().reverse(),
  ];
  const ownIndex = keys.findIndex(($1) => $1 === key);
  if (ownIndex < 0) return [false, null];
  const ownKey = keys[ownIndex];
  const ownValue = getThisOrSuperPro(target, ownKey);
  if (!!ownValue === true) return [true, ownValue];
  return [true, (CompareHandle as any)[key]];
}
