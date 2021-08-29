import Headers from "./Headers";
import Methods from "./Methods";

export default interface ReqOptions {
  method?: Methods;
  mode?: "no-cors" | "cors" | "same-origin";
  cache?: "default" | "no-cache" | "reload" | "force-cache" | "only-if-cached";
  credentials?: "include" | "same-origin" | "omit";
  headers?: Headers;
  redirect?: "manual" | "follow" | "error";
  referrerPolicy?:
    | "no-referrer"
    | "no-referrer-when-downgrade"
    | "origin"
    | "origin-when-cross-origin"
    | "same-origin"
    | "strict-origin"
    | "strict-origin-when-cross-origin"
    | "unsafe-url";
  body?: string;
}
