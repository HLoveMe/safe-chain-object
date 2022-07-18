### 如何优雅解决Javascript开发过程中数据类型判断或者空值判断

```typescript
// 1：依次判断每一个层级数据 
// 2：使用 可选链 语法
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

function renderItemView(result:FetchData){
    // 为防止参数空值报错,或者人为传值错误
    // 使用之前需要进行类型判断
    if(result && result.code === 200 && result.data && Array.isArray(result.data)){
        
    }
    // 或者采用可选类型
    if(result?.code === 200 && result.data && Array.isArray(result?.data)){
    	
    }
}


```

### 这里提供一个可选链的判断并提供便捷函数。

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

* 工具链

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
  ```

  

* 功能说明 

  * 安全的数据链

    ```typescript
    import { createSafe as $_} = from  'safe-chain-object';
    
    const target = $_({code:100,data:{}})
    // 数据链可无限
    target.data.Xpro.Ypro.Zprop.isEqual(200)
    ```

  * typeof操作符

    ```typescript
    import { createSafe as $_} = from  'safe-chain-object';
    
    const target = $_({code:100,data:{ id:10000,items:[] }})
    
    typeof target.data.id === 'function'
    typeof target.data.item === 'function'
    typeof target.data.item.forEach === 'function'
    ```

  * 解构

    ```typescript
    import { createSafe as $_} = from  'safe-chain-object';
    
    const target = $_({code:100,data:{ id:10000,items:[1,2,3] }})
    // 对象解构
    const  { id, items } =  target.data;
    // 数组解构
    const [$1,$2] = target.date.items;
    ```

  * 函数

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
  
  * instanceof类型判断
  
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

  * Object.prototype.toString.call 可正常使用
  
    ```typescript
     /**
    
     ** 可自行实现 Symbol.toStringTag
    
     */
    
     const toTypeString = Function.call.bind(Object.prototype.toString);
    
     const target = createSafe({a:[],b:1})
    
     toTypeString(target) === "[object Object]"
    
     toTypeString(target.a) === "[object Array]"
    
     toTypeString(target.b) === "[object Number]"
    
     toTypeString(target.sasb.sasa.asa.acdd) === "[object Undefined]"
    ```
  
    

