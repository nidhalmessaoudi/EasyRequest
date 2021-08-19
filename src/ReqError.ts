import ReqInfo from "./ReqInfo";

export default class ReqError extends Error {
  reqInfo: ReqInfo | null = null;
  noDefault = false;

  constructor(msg: string, reqInfo?: ReqInfo, noDefault?: boolean) {
    super(msg);
    if (reqInfo) {
      this.reqInfo = reqInfo;
    }
    if (noDefault) {
      this.noDefault = true;
    }
  }
}
