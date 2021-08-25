import JSONEditor from "jsoneditor";
import validUrl from "valid-url";

import "./styles.css";
import "jsoneditor/dist/jsoneditor.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "@material/fab/dist/mdc.fab.min.css";

import layout from "./layout";

import QueryParams from "./QueryParams";
import ReqHeaders from "./Headers";
import Body from "./Body";
import Popup from "./Popup";
import ReqError from "./ReqError";

export default class Main {
  public static CONFIG = {
    root: document.getElementById("root")! as HTMLDivElement,
    client: "https://easyrequest.netlify.app",
  };
  public static reqEndpoint: HTMLInputElement;
  public static headers: { [headerName: string]: string };
  public static body: string;
  private static reqForm: HTMLFormElement;
  private static reqType: HTMLSelectElement;
  private static reqOptionsBar: HTMLDivElement;
  private static sendReqBtn: HTMLButtonElement;
  private static resultsEditor: JSONEditor;
  private static switchTheme: HTMLSpanElement;
  private static themeIcon: HTMLElement;
  private static newTabBtn: HTMLButtonElement;
  private static timeoutMsg = "The server takes too long to respond!";

  public static main() {
    window.addEventListener("load", Main.loadHandler);
  }

  private static loadHandler() {
    ReqHeaders.onChange();
    Main.render("afterbegin", layout.initialLayout);
    Main.render("beforeend", layout.footerLayout);
    Main.reqForm = document.getElementById("req-form")! as HTMLFormElement;
    Main.reqType = document.getElementById("req-type")! as HTMLSelectElement;
    Main.reqEndpoint = document.getElementById(
      "req-endpoint"
    )! as HTMLInputElement;
    Main.sendReqBtn = document.getElementById("send-req")! as HTMLButtonElement;
    Main.reqOptionsBar = document.getElementById(
      "options-bar"
    ) as HTMLDivElement;
    Main.switchTheme = document.getElementById(
      "theme-switch"
    ) as HTMLSpanElement;
    const resultContainer = document.getElementById("json-results")!;
    Main.adjustTheme(false);
    Main.resultsEditor = new JSONEditor(resultContainer, {
      mode: "code",
    });
    Main.newTabBtn = document.getElementById("new-tab") as HTMLButtonElement;
    Main.resultsEditor.set({ Notice: "Results will appear here!" });
    Main.switchTheme.addEventListener("click", () => Main.adjustTheme(true));
    Main.reqForm.addEventListener("submit", Main.submitHandler);
    window.addEventListener("storage", () => Main.adjustTheme(false));
    Main.reqOptionsBar.addEventListener("click", Main.optionsClickHandler);
    Main.newTabBtn.addEventListener("click", Main.newTabHandler);
  }

  private static async submitHandler(e: Event) {
    try {
      e.preventDefault();

      Popup.close(true);

      const reqUrl = Main.reqEndpoint.value;

      if (!validUrl.isWebUri(reqUrl)) {
        Popup.main(false, undefined, "Unvalid request url!");
        return;
      }

      if (!validUrl.isHttpsUri(reqUrl)) {
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

      Main.sendReqBtn.textContent = "Sending";
      Main.sendReqBtn.disabled = true;
      Main.resultsEditor.set({ Notice: "Loading data..." });

      const reqTimer = Main.makeTimer(5);
      console.log(Main.body);
      const req = fetch(reqUrl, {
        method: Main.reqType.value,
        headers: Main.headers,
        body: Main.body,
      });

      const timeBeforeSend = new Date().getTime();
      const resOrTimer = (await Promise.race([req, reqTimer])) as
        | Response
        | string;

      const timeAfterSend = new Date().getTime();

      if (typeof resOrTimer === "string") {
        throw new ReqError(Main.timeoutMsg);
      }

      const reqDuration = timeAfterSend - timeBeforeSend;
      let res;
      if (resOrTimer instanceof Response) {
        res = await Main.handleResponse(resOrTimer, reqDuration);
      }

      const reqInfo = Main.getReqInfo(resOrTimer, reqDuration, res);

      if (!resOrTimer.ok) {
        if (res) {
          Main.resultsEditor.set(res);
        }
        throw new ReqError("The server returns a no OK status!", reqInfo, true);
      }

      Popup.main(true, reqInfo);

      Main.sendReqBtn.textContent = "Send";
      Main.sendReqBtn.disabled = false;
      Main.resultsEditor.set(res);
      Main.resultsEditor.focus();
    } catch (err) {
      let msg = err.message;
      if (err.name === "TypeError") {
        msg = "Failed to send the request! Check your connection.";
      }
      if (err.reqInfo) {
        Popup.main(false, err.reqInfo);
      } else {
        Popup.main(false, undefined, msg);
      }
      Main.styleInfail(err.noDefault ? false : true);
    }
  }

  public static render(
    position: InsertPosition,
    layout: string,
    parentEl?: HTMLElement
  ) {
    if (!parentEl) {
      Main.CONFIG.root.insertAdjacentHTML(position, layout);
      return;
    }
    parentEl.insertAdjacentHTML(position, layout);
  }

  private static adjustTheme(edit: boolean) {
    let theme = localStorage.getItem("theme");
    if (edit) {
      theme === "light"
        ? localStorage.setItem("theme", "dark")
        : localStorage.setItem("theme", "light");
      theme = localStorage.getItem("theme");
    }
    if (!theme) {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      theme = isDark ? "dark" : "light";
      localStorage.setItem("theme", theme);
    }
    if (Main.themeIcon) Main.switchTheme.removeChild(Main.themeIcon);
    if (theme === "light") {
      Main.switchTheme.insertAdjacentHTML("afterbegin", layout.darkIconLayout);
      document.body.classList.remove("dark-theme");
      document.body.classList.add("light-theme");
      Main.reqEndpoint?.classList.remove("form-control__dark-theme");
      Main.reqType?.classList.remove("type-selection__dark-theme");
      const editorDarkStyle = document.getElementById("editor-dark");
      if (editorDarkStyle) {
        document.body.removeChild(editorDarkStyle);
      }
    } else {
      Main.switchTheme.insertAdjacentHTML("afterbegin", layout.lightIconLayout);
      document.body.classList.remove("light-theme");
      document.body.classList.add("dark-theme");
      Main.reqType?.classList.add("type-selection__dark-theme");
      Main.reqEndpoint?.classList.add("form-control__dark-theme");
      Main.render("beforebegin", layout.editorDarkStyle);
    }
    Main.themeIcon = document.getElementById("bi-theme") as HTMLElement;
    Popup.adjustTheme();
  }

  private static getReqInfo(
    fullRes: Response,
    reqTime: number,
    resBody?: JSON
  ) {
    const statusCode = fullRes.status;
    const resSize = new TextEncoder().encode(
      JSON.stringify(resBody ? resBody : fullRes)
    ).length;
    return {
      Status: String(statusCode),
      Time: String(reqTime),
      Size: (resSize / 1024).toFixed(2),
    };
  }

  private static async handleResponse(res: Response, reqTime: number) {
    try {
      const resOnText = await res.text();
      const resOnJson = JSON.parse(resOnText);
      return resOnJson;
    } catch (err) {
      throw new ReqError(
        "ParseError: Did not receive JSON!",
        Main.getReqInfo(res, reqTime)
      );
    }
  }

  private static optionsClickHandler(e: Event) {
    const target = e.target as HTMLElement;
    switch (target?.dataset.name) {
      case "params":
        QueryParams.main();
        break;
      case "headers":
        ReqHeaders.main();
        break;
      case "body":
        Body.main();
        break;
    }
  }

  private static makeTimer(sec: number) {
    return new Promise((res) => {
      setTimeout(() => {
        res("Timer finished!");
      }, sec * 1000);
    });
  }

  private static styleInfail(editOnEditor = true) {
    if (editOnEditor) {
      Main.resultsEditor.set({ Notice: "failed to load data!" });
    }
    Main.sendReqBtn.disabled = false;
    Main.sendReqBtn.textContent = "Send";
  }

  private static newTabHandler() {
    open(Main.CONFIG.client, "_blank");
  }
}
