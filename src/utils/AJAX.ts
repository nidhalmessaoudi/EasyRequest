import validUrl from "valid-url";
import makeTimer from "../Helpers/makeTimer";
import ReqOptions from "../Interfaces/ReqOptions";
import ReqError from "./ReqError";

export default class AJAX {
  private static self: AJAX;
  private url!: string;
  private options?: ReqOptions;

  private constructor() {}

  public static main(url: URL, options?: ReqOptions) {
    if (!this.self) {
      AJAX.self = new AJAX();
    }
    this.self.init(url, options);
    return AJAX.self;
  }

  private init(url: URL, options?: ReqOptions) {
    const urlStr = String(url);

    this.validateURL(urlStr);

    this.url = urlStr;
    this.options = options;
  }

  public asyncRequest() {
    return fetch(this.url, this.options);
  }

  public async send() {
    const reqTimer = makeTimer(7);
    const req = this.asyncRequest();

    const timeBeforeSend = new Date().getTime();
    const resOrTimer = (await Promise.race([req, reqTimer])) as
      | Response
      | string;

    const timeAfterSend = new Date().getTime();

    if (typeof resOrTimer === "string") {
      throw new ReqError("The server takes too long to respond!");
    }

    const reqDuration = timeAfterSend - timeBeforeSend;
    let res;
    if (resOrTimer instanceof Response) {
      res = await this.handleResponse(resOrTimer, reqDuration);
    }

    const reqInfo = this.getReqInfo(resOrTimer, reqDuration, res);

    if (!resOrTimer.ok) {
      throw new ReqError(
        "The server returns a no OK status!",
        res,
        reqInfo,
        true
      );
    }

    return {
      data: res,
      info: reqInfo,
    };
  }

  public specifyError(err: Error) {
    let msg = err.message;
    if (err.name === "TypeError") {
      if (!navigator.onLine) {
        msg = "Failed to send the request! Probably you lost your connection.";
      } else {
        msg = `Request blocked by <a
         href="https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS"
         target="_blank"
        >
         CORS
        </a> policy.`;
      }
    }
    return msg;
  }

  private validateURL(url: string) {
    if (!validUrl.isWebUri(url)) {
      throw new ReqError("Unvalid request url!");
    }

    if (!validUrl.isHttpsUri(url)) {
      throw new ReqError(
        `Unsecure request url! Use
             <a 
              href="https://developer.mozilla.org/en-US/docs/Glossary/https"
              target="_blank"
             >
              https
             </a> instead.`
      );
    }
  }

  private async handleResponse(res: Response, reqTime: number) {
    try {
      const resOnText = await res.text();
      const resOnJson = JSON.parse(resOnText);
      return resOnJson;
    } catch (err) {
      throw new ReqError(
        "ParseError: Did not receive JSON!",
        this.getReqInfo(res, reqTime)
      );
    }
  }

  private getReqInfo(fullRes: Response, reqTime: number, resBody?: JSON) {
    const statusCode = fullRes.status;
    const resSize = new TextEncoder().encode(
      JSON.stringify(resBody ? resBody : fullRes)
    ).length;
    return {
      Status: statusCode,
      Time: reqTime,
      Size: +(resSize / 1024).toFixed(2),
    };
  }
}
