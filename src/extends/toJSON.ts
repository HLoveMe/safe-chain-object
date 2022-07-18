import { getThisOrSuperPro, NULL } from '../util';
import NullUndefined from '../wrapper';

/** JSON */
export default function hasJsonOperation(
  target: any,
  key: string | symbol,
  defaultValue: NULL,
): [boolean, any] {
  if (key !== 'toJSON') return [false, null];
  if (NullUndefined.is(target)) return [true, () => defaultValue];
  const toJSON = getThisOrSuperPro(target, key);
  if (toJSON) {
    const value = typeof toJSON === 'function' ? (toJSON as Function).bind(target) : toJSON;
    return [true, value];
  }
  return [true, () => target];
}
