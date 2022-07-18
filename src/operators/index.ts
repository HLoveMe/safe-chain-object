import ObjectEnumType from '../objectEnum';
import { UtilFunc } from '../UtilFunc';
export type ExecFunction = (this: any, target: any) => () => boolean;
export type Space = Record<string | number | symbol, ExecFunction>;
export const isEqual: (target: any, isDepth?: boolean) => ExecFunction =
  function (target: any, isDepth?: boolean) {
    return (source: any) =>
      UtilFunc.isEqual.bind(UtilFunc, source, undefined, target, isDepth);
  };

export const isNull: ExecFunction = () =>
  UtilFunc.isNull.bind(UtilFunc, null, undefined);
export const isUndefined: ExecFunction = () =>
  UtilFunc.isUndefined.bind(UtilFunc, undefined, undefined);

export const isNumber: ExecFunction = function (source: any) {
  return UtilFunc.isObjectTypeOf.bind(
    UtilFunc,
    source,
    undefined,
    ObjectEnumType.Number
  );
};
export const isString: ExecFunction = function (source: any) {
  return UtilFunc.isObjectTypeOf.bind(
    UtilFunc,
    source,
    undefined,
    ObjectEnumType.String
  );
};
export const isBoolean: ExecFunction = function (source: any) {
  return UtilFunc.isObjectTypeOf.bind(
    UtilFunc,
    source,
    undefined,
    ObjectEnumType.Boolean
  );
};
export const isObject: ExecFunction = function (source: any) {
  return UtilFunc.isObjectTypeOf.bind(
    UtilFunc,
    source,
    undefined,
    ObjectEnumType.Object
  );
};
export const isSymbol: ExecFunction = function (source: any) {
  return UtilFunc.isObjectTypeOf.bind(
    UtilFunc,
    source,
    undefined,
    ObjectEnumType.Symbol
  );
};

export const isFunction: ExecFunction = function (source: any) {
  return UtilFunc.isObjectTypeOf.bind(
    UtilFunc,
    source,
    undefined,
    ObjectEnumType.Function
  );
};
export const isDate: ExecFunction = function (source: any) {
  return UtilFunc.isObjectTypeOf.bind(
    UtilFunc,
    source,
    undefined,
    ObjectEnumType.Date
  );
};
export const isRegExp: ExecFunction = function (source: any) {
  return UtilFunc.isObjectTypeOf.bind(
    UtilFunc,
    source,
    undefined,
    ObjectEnumType.RegExp
  );
};
export const isPromise: ExecFunction = function (source: any) {
  return UtilFunc.isObjectTypeOf.bind(
    UtilFunc,
    source,
    undefined,
    ObjectEnumType.Promise
  );
};
export const isArray: ExecFunction = function (source: any) {
  return UtilFunc.isObjectTypeOf.bind(
    UtilFunc,
    source,
    undefined,
    ObjectEnumType.Array
  );
};
export const isSet: ExecFunction = function (source: any) {
  return UtilFunc.isObjectTypeOf.bind(
    UtilFunc,
    source,
    undefined,
    ObjectEnumType.Set
  );
};
export const isMap: ExecFunction = function (source: any) {
  return UtilFunc.isObjectTypeOf.bind(
    UtilFunc,
    source,
    undefined,
    ObjectEnumType.Map
  );
};

/**
 shape({
    name:isString,
    age:isNumber,
    child:shape({
      name:isString,
      sex:isBoolean
    })
 })
 * @param space 
 * @returns 
 */
export const shape: (space: Space) => ExecFunction = (space: Space) => {
  return function (this: any, target: any) {
    return function () {
      return Object.keys(space).every(($1) => {
        const exec = space[$1];
        const res = exec(target[$1])();
        if (typeof res === 'boolean') return res;
        return false;
      });
    };
  };
};
