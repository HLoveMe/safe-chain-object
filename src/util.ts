/* tslint-disable */
import NullUndefined from './wrapper';

declare interface TypeObject {
  type: string; // [object Number]
  literalType: string; // Number
}

declare type NULL = null | undefined;
declare type ReturnString = (...args: any[]) => string;
declare type ReturnBoolean = (...args: any[]) => boolean;
export const FuncTag = 'safe-chain-object-wrapper-function';

const has: ReturnBoolean = Function.call.bind(
  Object.prototype.hasOwnProperty
) as unknown as ReturnBoolean;

const toTypeString: ReturnString = Function.call.bind(
  Object.prototype.toString
) as unknown as ReturnString;
// 获取具体类型
const getType = (value: string) => {
  const result = value.match(/\[object (\w+)\]/) || [];
  return result[1];
};

// 获取原型链上的属性
const getThisOrSuperPro = function (
  target: Object,
  key: string | symbol,
  depth = 0
): any | null {
  if (NullUndefined.is(target)) return null;
  if (target.constructor === Object && depth !== 0) return null;
  if (has(target, key)) return (target as any)[key] as any;
  // TODO: 处理__proto__ 警告 __proto__会被删除
  // eslint-disable-next-line dot-notation
  return getThisOrSuperPro((target as any)['__proto__'], key, depth + 1);
};

const getTop = () => {
  var freeGlobal =
    typeof global == 'object' && global && global.Object === Object && global;

  var freeSelf =
    typeof self == 'object' && self && self.Object === Object && self;

  return freeGlobal || freeSelf || Function('return this')();
};

const LiteralTypeInfo: Array<TypeObject> = ((...args) =>
  args.map((item) => {
    const type = toTypeString(item);
    const literalType = getType(type);
    return {
      type,
      literalType,
    };
  }))(1, '', false);

function isWrapperFunction(target: any): boolean {
  return typeof target === 'function' && target.nameTag === FuncTag;
}

function createFunctionWrapper(source: any) {
  const Wrapper = function (...args: any[]) {
    if (typeof source === 'function') {
      return (source as Function)(...args);
    }
  };
  Wrapper.source = source;
  Wrapper.nameTag = FuncTag;
  return Wrapper;
}

// 包装
function getOperationTarget(target: any): any {
  const literal: TypeObject | undefined = LiteralTypeInfo.find(
    ($1) => $1.type === toTypeString(target)
  );
  let source;
  if (literal) {
    const { literalType } = literal;
    const ObjectClass = (getTop() as any)[literalType];
    source = new ObjectClass(target);
  } else {
    source =
      target === null || target === undefined
        ? new NullUndefined(target)
        : target;
  }
  return createFunctionWrapper(source);
}

function isLiteral(source: any) {
  return (
    typeof source === 'string' ||
    typeof source === 'boolean' ||
    typeof source === 'number'
  );
}
// function createLiteralObject(source: any) { if (typeof source === 'string') return new Number(source); if (source === 'boolean') return new Boolean(source); if (typeof source === 'string') return new String(source); return new Object() }
function getEvalConstructor(
  source: string | boolean | number
): CallableFunction {
  try {
    return Function('"use strict"; return (' + source + ').constructor;')();
  } catch (e: any) {
    return Object;
  }
}
function createLiteralObject(source: string | boolean | number) {
  if (isLiteral(source)) {
    const callFunc = getEvalConstructor(source);
    return Reflect.construct(callFunc, [source]);
  }
  return new Object();
}

// 是否是class 类型
function isClass(source: Function) {
  const sStr = (source.prototype?.constructor || source.constructor).toString();
  return sStr && sStr.startsWith(`class ${source.name}`);
}

// 是否为系统默认的类型
function isTopTarget(source: Function) {
  return (
    getTop()[source.name] === source &&
    source.toString() === `function ${source.name}() { [native code] }`
  );
}

function isObjectConstructor(source: Function) {
  return isClass(source) || isTopTarget(source);
}

export {
  getTop,
  has,
  isLiteral,
  createLiteralObject,
  isObjectConstructor,
  getType,
  toTypeString,
  getThisOrSuperPro,
  getOperationTarget,
  isWrapperFunction,
};
export type { NULL, TypeObject };
