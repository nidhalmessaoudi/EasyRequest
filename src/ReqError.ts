import ReqInfo from "./ReqInfo";

export default class ReqError extends Error {
  reqInfo: ReqInfo | null;

  constructor(msg: string, reqInfo?: ReqInfo) {
    super(msg);
    if (reqInfo) {
      this.reqInfo = reqInfo;
    } else {
      this.reqInfo = null;
    }
  }
}
