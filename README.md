### 如何优雅解决 Javascript 开发过程中数据类型判断或者空值判断

safe-chain-object 解决 Javascript 项目中，对值进行数据类型，值判断的复杂性，支持无限层级数据判断，支持常用类型判断。

## Installation and Usage

- 安装
  ```
  npm i git+https://github.com/HLoveMe/safe-chain-object.git
  ```
- 引用和使用
  ```typescript 
  import { createSafe as $_} = from 'safe-chain-object'; 
  const data:any = {code:200,message:'success',data:[]} 
  const _data = $_(data) 
  if(_data.data.isArray() && _data.code.isEqual(200)){ 
    //do something 
  } 
  ```

  ```typescript 
  import { createSafe as $_} = from 'safe-chain-object'; 
  const data:any = {code:200,message:'success',data:{}} 
  const _data = $_(data) //可无限取值， 解决undefined 引发的崩溃问题 
  if(_data.data.message.code.isEqual(200)){ 
    // 
    }
  ```

##更多用法

### 类型判断。这里提供一个可选链的判断并提供便捷函数。

```typescript
// 解决无限层级数据判断
class Item{
    id:string;
    name:string;
    create_time:Date;
    child?:Item
}
class FetchData{
    code:Number;
    message:String;
    data:Array<Item>
}
import { createSafe as $_} = from  'safe-chain-object';

function renderItemView(result:FetchData){
    // 为防止参数空值报错,或者人为传值错误
    const chain = $_(result)
    if(chain.code.isEqual(200) && chain.data.isArray() && chain.data.arrayEvery(Item)){
        // code 为200 并且data 为 Item 数组
    }
}
```

```typescript
import { createSafe } = from  'safe-chain-object';
import { isNumber ,shape,isString ,isEqual} = from  'safe-chain-object/operators';
// dome1
const source1 =createSafe({data:100});
source1.data.validator(isNumber,isEqual(100))

// dome2
const source2 = createSafe({id:111,title:"说明",info:{code:200,message:'success'}})
source2.validator(shape({
  id:isNumber,
  info:shape({
    code:isEqual(200)
  })
}))
```

## 工具链

```typescript
instanceof(prototype: Function): boolean;
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
isEqual(target: any): boolean;
isTruly(): boolean;
// 判断数据是否全部为true
/***
* class Item{}
* source.arrayEvery((item)=>{
*  return isItem(item)
* })
*/
arrayEvery<T>(compare: (item: T) => boolean): boolean;
/***
* class Item{}
* source.arrayEvery(Item)
*/
arrayEvery<T>(compare: Function): boolean;
// 空对象 {}
// 空集合 (Array|Set|Map).(length|size) === 0
isEmpty(): boolean;


validator(...args:Function[]):boolean;
```

- 功能说明

  - 安全的数据链

    ```typescript
    import { createSafe as $_} = from  'safe-chain-object';

    const target = $_({code:100,data:{}})
    // 数据链可无限
    target.data.Xpro.Ypro.Zprop.isEqual(200)
    ```

  - typeof 操作符

    ```typescript
    import { createSafe as $_} = from  'safe-chain-object';

    const target = $_({code:100,data:{ id:10000,items:[] }})

    typeof target.data.id === 'function'
    typeof target.data.item === 'function'
    typeof target.data.item.forEach === 'function'
    ```

  - 解构

    ```typescript
    import { createSafe as $_} = from  'safe-chain-object';

    const target = $_({code:100,data:{ id:10000,items:[1,2,3] }})
    // 对象解构
    const  { id, items } =  target.data;
    // 数组解构
    const [$1,$2] = target.date.items;
    ```

  - 函数

    ```typescript
    import { createSafe as $_} = from  'safe-chain-object';

    const source = {code:100,data:{ id:10000,items:[1,2,3] }}
    const target = $_(source)
    // target.a.b.c.d() 可执行，return NULL;
    // 可行 但不推荐。
    target.data.items.forEach(callback)
    //推荐写法
    if(target.data.items.isArray()){
        source.data.items.forEach
    }
    ```

  - instanceof 类型判断

    ```typescript
    import { createSafe as $_} = from  'safe-chain-object';

    const target = $_({item:[]})
    target.item instanceof Array // success
    target.item instanceof Number // fail
    target.sa.a.sas.as  instanceof Object 始终成立

    target.sa.a.sas.as  instanceof Function 始终成立
    ==============
    class Item {}
    const target = $_({item:new Item()})
    target.item instanceof Item // true

    ```

  - Object.prototype.toString.call 可正常使用

    ```typescript
    /**
    
     ** 可自行实现 Symbol.toStringTag
    
     */

    const toTypeString = Function.call.bind(Object.prototype.toString);

    const target = createSafe({ a: [], b: 1 });

    toTypeString(target) === '[object Object]';

    toTypeString(target.a) === '[object Array]';

    toTypeString(target.b) === '[object Number]';

    toTypeString(target.sasb.sasa.asa.acdd) === '[object Undefined]';
    ```

## Dome 测试

- 浏览器打开 /test/index.html
