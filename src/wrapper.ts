import { NULL } from './util';

export default class NullUndefined {
  value: NULL;

  constructor(value: NULL) {
    this.value = value;
  }

  static is(target: any) {
    return target instanceof NullUndefined;
  }
}
