import ObjectEnumType from './objectEnum';
import { ExecFunction } from './operators';
import {
  getType,
  NULL,
  toTypeString,
  has,
  isLiteral,
  createLiteralObject,
  isObjectConstructor,
  getTop,
} from './util';
import NullUndefined from './wrapper';

// hasUtil
class UtilFunc {
  static init() {
    Object.keys(ObjectEnumType).forEach(($1) => {
      const funcName = `is${$1}`;
      if (!!(UtilFunc as any)[funcName] === true) return;
      (UtilFunc as any)[funcName] = function (target: any, defaultValue: NULL) {
        if (NullUndefined.is(target)) return false;
        const top = getTop();
        return UtilFunc.isObjectTypeOf.bind(
          top,
          target,
          defaultValue
        )((ObjectEnumType as any)[$1]);
      };
    });
  }
  static instanceof(target: any, defaultValue: NULL, prototype: Function) {
    if (NullUndefined.is(target)) {
      return false;
    }
    return target instanceof prototype;
  }
  static isObjectTypeOf(
    target: any,
    defaultValue: NULL,
    targetType: ObjectEnumType | string
  ): boolean {
    let source: any = target;
    if (NullUndefined.is(target))
      source = (target as unknown as NullUndefined).value;
    const typeStr = getType(toTypeString(source));
    return typeStr === targetType;
  }
  static isNull(target: NULL, defaultValue: NULL) {
    if (NullUndefined.is(target)) {
      return (target as unknown as NullUndefined).value === null;
    }
    return UtilFunc.isObjectTypeOf.bind(
      getTop(),
      target,
      defaultValue
    )(ObjectEnumType.Null);
  }
  static isUndefined(target: NULL, defaultValue: NULL) {
    if (NullUndefined.is(target)) {
      return (target as unknown as NullUndefined).value === undefined;
    }
    return UtilFunc.isObjectTypeOf.bind(
      getTop(),
      target,
      defaultValue
    )(ObjectEnumType.Undefined);
  }
  static isEqual(
    target: any, //1==2 =>1
    defaultValue: NULL,
    source: any,
    isDepth: boolean = false
  ) {
    if (NullUndefined.is(target)) {
      if (isDepth) {
        return (target as unknown as NullUndefined).value === source;
      }
      return (target as unknown as NullUndefined).value == source;
    }
    if (isDepth) {
      return target === source;
    }
    return target == source;
  }
  static isTruly(): Boolean {
    const target = this;
    if (NullUndefined.is(target)) return false;
    return !!target;
  }
  // 是否为一个空对象，集合，映射或者。
  static isEmpty(target: any) {
    if (NullUndefined.is(target)) return false;
    if (Array.isArray(target)) return (target as Array<any>).length === 0;
    if (target instanceof Set) return (target as Set<any>).size === 0;
    if (target instanceof Map) return (target as Map<any, any>).size === 0;
    return Object.getOwnPropertyDescriptors(target).length === 0;
  }
  static arrayEvery(target: any, defaultValue: NULL, compare: Function) {
    if (NullUndefined.is(target)) return false;
    if (typeof compare !== 'function') return false;
    if (Array.isArray(target) === false) return false;
    const isNewFunction = isObjectConstructor(compare);
    return (target as any as Array<any>).every(($1) => {
      if (isNewFunction) {
        return $1 instanceof compare;
      } else return !!(compare as unknown as (source: any) => boolean)($1);
    });
  }
  // exact(defaultValue: NULL, source: any) {}
  // shape(defaultValue: NULL, source: any) {}
  static validator(target: any, defaultValue: NULL, ...args: ExecFunction[]) {
    var isFail = false;
    try {
      isFail = args.some(($1) => {
        var exec: ExecFunction = $1;
        if (exec(target)() === false) return true;
        return false;
      });
    } catch (error) {
      isFail = true;
    } finally {
      return !isFail;
    }
  }
}

UtilFunc.init();

function hasUtil(
  target: any,
  key: string | symbol,
  defaultValue: NULL
): [boolean, any] {
  if (has(UtilFunc, key)) {
    if (has(target, key)) {
      return [true, target[key].bind(target)];
    }
    return [true, (UtilFunc as any)[key].bind(UtilFunc, target, defaultValue)];
  }
  return [false, null];
}

export { hasUtil, UtilFunc };
