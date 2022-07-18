/* eslint-disable no-shadow */

declare type Chain = { [key in string | number | symbol]: SafeValue };
declare type SafeValue = Util & Chain;
declare type NULL = null | undefined;
declare type ExecFunction = (this: any, target: any) => () => boolean;
declare interface ClassConstructor {
  new (...args: any[]): any;
}
declare enum ObjectEnumType {
  Null,
  Undefined,
  Number,
  String,
  Boolean,
  Function,
  Symbol,
  Date,
  RegExp,
  Promise,
  Array,
  Set,
  Map,
}

declare interface Util {
  instanceof(prototype: ClassConstructor): boolean;
  isObjectTypeOf(targetType: ObjectEnumType | string): boolean;
  isNull(): boolean;
  isUndefined(): boolean;
  isNumber(): boolean;
  isString(): boolean;
  isBoolean(): boolean;
  isFunction(): boolean;
  isSymbol(): boolean;
  isDate(): boolean;
  isRegExp(): boolean;
  isPromise(): boolean;
  isArray(): boolean;
  isMap(): boolean;
  isSet(): boolean;
  // 字面量 会转为对应的数据对象。1==>Number false==>Boolean ''===>String
  /***
   * target: 比较对象
   * isDepth：是否深度比较===，默认为== 进行比较
   */
  isEqual(target: any, isDepth?: boolean): boolean;
  isTruly(): boolean;
  // 空对象 {}
  // 空集合 (Array|Set|Map).(length|size) === 0
  isEmpty(): boolean;

  // 判断数据是否全部为true
  /**
   * class Item{}
   * arrayEvery(Item) // instanceof
   * @param compare
   */
  arrayEvery<T>(compare: (item: T) => boolean): boolean;

  // class Item{}
  // source.arrayEvery((item)=>{
  //  return isItem(item)
  // })
  arrayEvery<T>(compare: (item: T) => boolean): boolean;

  validator(...args: ExecFunction[]): boolean;
}

declare function createSafe<T>(
  initData: T,
  defaultValue?: NULL
): SafeValue & CallableFunction;
export * from './dist/types/operators/index';
export { createSafe, ObjectEnumType };