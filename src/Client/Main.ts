import { boundMethod } from "autobind-decorator";

import "../styles/main.css";
import "jsoneditor/dist/jsoneditor.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "@material/fab/dist/mdc.fab.min.css";

import layout from "../layouts/layout";

import CONFIG from "../utils/CONFIG";
import DOM from "./DOM";
import AJAX from "../utils/AJAX";
import Methods from "../Interfaces/Methods";
import ThemeController from "./ThemeController";
import render from "../Helpers/render";
import QueryParams from "../Modals/QueryParams";
import ReqHeaders from "../Modals/Headers";
import Body from "../Modals/Body";
import Popup from "../Popup/Popup";
import Headers from "../Interfaces/Headers";
import sendToApi from "../Helpers/sendToApi";

export default class Main {
  public static self: Main;
  public headers: Headers = CONFIG.headers;
  public body!: string;
  private dom!: DOM;
  private ajax!: AJAX;
  private themeController!: ThemeController;
  private popup!: Popup;

  private constructor() {
    window.addEventListener("load", this.loadHandler);
  }

  public static main() {
    if (!this.self) {
      this.self = new Main();
    }
    return this.self;
  }

  @boundMethod
  private loadHandler() {
    CONFIG.root.innerHTML = "";

    render("afterbegin", layout.initialLayout);
    render("beforeend", layout.footerLayout);

    this.dom = DOM.main();
    this.themeController = ThemeController.main(this.dom);
    this.themeController.adjustTheme(false, this.popup);
    this.dom.resultsEditor.set({ Notice: "Results will appear here!" });
    this.attachHandlers();
  }

  @boundMethod
  private attachHandlers() {
    this.dom.switchTheme.addEventListener("click", () =>
      this.themeController.adjustTheme(true, this.popup)
    );
    this.dom.reqForm.addEventListener("submit", this.submitHandler);
    window.addEventListener("storage", () => {
      this.themeController.adjustTheme(false, this.popup);
    });
    this.dom.reqOptionsBar.addEventListener("click", this.optionsClickHandler);
    this.dom.newTabBtn.addEventListener("click", this.newTabHandler);
  }

  @boundMethod
  private async submitHandler(e: Event) {
    try {
      e.preventDefault();

      this.popup?.close(true);

      const reqUrl = this.dom.reqEndpoint.value;
      const reqMethod = this.dom.reqType.value as Methods;

      this.ajax = AJAX.main(reqUrl, {
        method: reqMethod,
        headers: this.headers,
        body: this.body,
      });

      this.dom.sendReqBtn.textContent = "Sending";
      this.dom.sendReqBtn.disabled = true;
      this.dom.resultsEditor.set({ Notice: "Loading data..." });

      const response = await this.ajax?.send();
      if (!response) return;

      const { data, info } = response;

      this.popup = Popup.main(true, info);

      this.dom.sendReqBtn.textContent = "Send";
      this.dom.sendReqBtn.disabled = false;
      this.dom.resultsEditor.set(data);
      this.dom.resultsEditor.focus();

      await sendToApi(true, info);
    } catch (err) {
      if (!this.ajax) this.ajax = AJAX.self;
      let msg = this.ajax?.specifyError(err);
      if (err.reqInfo) {
        this.popup = Popup.main(false, err.reqInfo);
      } else {
        this.popup = Popup.main(false, undefined, msg);
      }

      if (err.res) {
        this.dom.resultsEditor.set(err.res);
      }

      this.styleInfail(err.noDefault ? false : true);
      await sendToApi(false, err.reqInfo, msg);
    }
  }

  @boundMethod
  private optionsClickHandler(e: Event) {
    const target = e.target as HTMLElement;
    switch (target?.dataset.name) {
      case "params":
        QueryParams.main(this.dom);
        break;
      case "headers":
        ReqHeaders.main(this);
        break;
      case "body":
        Body.main(this);
        break;
    }
  }

  private styleInfail(editOnEditor = true) {
    if (editOnEditor) {
      this.dom.resultsEditor.set({ Notice: "failed to load data!" });
    }
    this.dom.sendReqBtn.disabled = false;
    this.dom.sendReqBtn.textContent = "Send";
  }

  @boundMethod
  private newTabHandler() {
    open(CONFIG.client, "_blank");
  }
}
