import ERArrayDelegate from "../Interfaces/ERArrayDelegate";

export default class ERArray<T> {
  private struct!: T[];
  private _delegate?: ERArrayDelegate<T>;

  constructor(...args: T[]) {
    this.init(...args);
  }

  get data() {
    return this.struct;
  }

  set delegate(theDelegate: ERArrayDelegate<T>) {
    this._delegate = theDelegate;
  }

  public init(...args: T[]) {
    this.struct = [];
    args.forEach((arg) => this.struct.push(arg));
    this._delegate?.onChange(this);
  }

  public push(el: T) {
    this.struct.push(el);
    this._delegate?.onChange(this);
  }

  public update(oldObj: T, newObj: T) {
    this.struct[this.struct.indexOf(oldObj)] = newObj;
    this._delegate?.onChange(this);
  }

  public clear() {
    this.struct = [];
  }
}
