import ReqInfo from "../Interfaces/ReqInfo";

export default class ReqError extends Error {
  reqInfo: ReqInfo | null = null;
  noDefault = false;
  res: any;
  custom = true;

  constructor(msg: string, reqInfo?: ReqInfo, res?: any, noDefault?: boolean) {
    super(msg);
    if (reqInfo) {
      this.reqInfo = reqInfo;
    }
    this.res = res;
    if (noDefault) {
      this.noDefault = true;
    }
  }
}
