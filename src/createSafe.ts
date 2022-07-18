/* eslint-disable no-proto */

import hasCompare from './extends/toCompare';
import hasDeconstruction from './extends/toDeconstruction';
import { hasUtil } from './UtilFunc';
import hasJsonOperation from './extends/toJSON';
import hasToString from './extends/toStringTag';
import { getOperationTarget, has, isWrapperFunction, NULL } from './util';
import NullUndefined from './wrapper';
import ObjectEnumType from './objectEnum';

function hasOperation(
  target: any,
  key: string | symbol,
  defaultValue: NULL = undefined
) {
  const [_hasU, util] = hasUtil(target, key, defaultValue);
  if (_hasU) return [true, util];
  const [_hasC, comValue] = hasCompare(target, key);
  if (_hasC) return [true, comValue];
  const [_hasD, dValue] = hasDeconstruction(
    target,
    key,
    defaultValue,
    createSafe
  );
  if (_hasD) return [true, dValue];
  const [_hasT, toString] = hasToString(target, key, defaultValue);
  if (_hasT) return [true, toString];
  const [_hasJ, jsonValue] = hasJsonOperation(target, key, defaultValue);
  if (_hasJ) return [true, jsonValue];
  return [false, null];
}

function createSafe(initData: any, defaultValue: NULL = undefined): any {
  let source = getOperationTarget(initData);
  return new Proxy(source, {
    apply(execFunc, thisArg, params) {
      return execFunc(...params);
    },
    get(target: any, key: string | symbol) {
      target = isWrapperFunction(target) ? target.source : target;
      const [_has, _value] = hasOperation(target, key, defaultValue);
      if (_has) return _value;
      let value = target[key] ?? defaultValue;
      if (typeof value === 'function') value = value.bind(target);
      return createSafe(value, defaultValue);
    },
    ownKeys() {
      let _source = isWrapperFunction(source) ? source.source : source;
      if (NullUndefined.is(_source)) _source = {};
      return [
        ...Object.getOwnPropertyNames(_source),
        ...Object.getOwnPropertySymbols(_source),
      ];
    },
    getPrototypeOf(t) {
      t = isWrapperFunction(t) ? t.source : t;
      if (NullUndefined.is(t)) return NullUndefined;
      return Object.getPrototypeOf(t);
    },
    getOwnPropertyDescriptor(target: any, p: string | symbol) {
      let _source = isWrapperFunction(source) ? source.source : source;
      const _target = isWrapperFunction(target) ? target.source : target;
      if (NullUndefined.is(_source)) _source = {};
      return Object.getOwnPropertyDescriptor(_target, p);
    },
    has(target: any, key: string | symbol) {
      let _source = isWrapperFunction(source) ? source.source : source;
      const _target = isWrapperFunction(target) ? target.source : target;
      if (NullUndefined.is(_source)) return false;
      return has(_target, key) as boolean;
    },
  });
}
export { createSafe, ObjectEnumType };
