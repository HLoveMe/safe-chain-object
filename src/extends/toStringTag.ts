/** Symbol.toStringTag */

import { getThisOrSuperPro, getType, toTypeString, NULL } from '../util';
import NullUndefined from '../wrapper';

/** {  get [Symbol.toStringTag](){return 'OwnType'} } */
export default function hasToString(
  target: any,
  key: string | symbol,
  defaultValue: NULL,
): [boolean, any] {
  if (key !== Symbol.toStringTag) return [false, null];
  const ownValue = getThisOrSuperPro(target, key);
  if (ownValue) return [true, ownValue];
  return [true, getType(toTypeString(NullUndefined.is(target) ? defaultValue : target))];
}
