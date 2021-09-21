import ERArray from "../utils/ERArray";

export default interface ERArrayDelegate<T> {
  onChange(erArray: ERArray<T>): void;
}
