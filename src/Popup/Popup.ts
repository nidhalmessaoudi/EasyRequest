import status from "http-status";
import { boundMethod } from "autobind-decorator";

import "../styles/popup.css";

import render from "../Helpers/render";
import layout from "../layouts/layout";
import ReqInfo from "../Interfaces/ReqInfo";

export default class Popup {
  public static self: Popup;
  private popup!: HTMLDivElement | null;
  private body!: HTMLDivElement;
  private closeBtn!: HTMLElement;

  private constructor() {}

  public static main(state: boolean, info?: ReqInfo, error?: string) {
    if (!this.self) {
      this.self = new Popup();
    }
    this.self.init(state, info, error);
    return this.self;
  }

  private init(state: boolean, info?: ReqInfo, error?: string) {
    render("afterbegin", layout.popupLayout);
    this.popup = document.getElementById("popup-main") as HTMLDivElement;
    this.adjustTheme();
    if (state) {
      render("afterbegin", layout.popupSuccessLayout, this.popup);
    } else {
      render("afterbegin", layout.popupFailLayout, this.popup);
    }
    this.body = document.querySelector(".popup-body") as HTMLDivElement;
    if (!info) {
      this.renderError(error!);
    } else {
      this.renderInfo(info);
    }
    this.closeBtn = document.getElementById("popup-close") as HTMLElement;
    this.closeBtn.addEventListener("click", this.closeHandler);
  }

  private renderInfo(reqInfo: ReqInfo) {
    let info: {
      [prop: string]: string;
    } = {};

    for (const prop in reqInfo) {
      switch (prop) {
        case "Status":
          const statusCode = Number(reqInfo[prop]);
          info[prop] = `${statusCode} ${String(
            status[statusCode]
          ).toUpperCase()}`;
          break;
        case "Time":
          info[prop] = `${reqInfo[prop]} ms`;
          break;
        case "Size":
          info[prop] = `${reqInfo[prop]} KB`;
      }
      const popupInfo = document.createElement("span");
      popupInfo.classList.add("popup-info");
      popupInfo.textContent = `${prop}: ${info[prop]}`;
      this.body.appendChild(popupInfo);
    }
  }

  private renderError(error: string) {
    const popupError = document.createElement("p");
    popupError.classList.add("popup-error");
    popupError.insertAdjacentHTML("afterbegin", error);
    this.body.appendChild(popupError);
  }

  public adjustTheme() {
    if (!this.popup) return;
    const theme = localStorage.getItem("theme");
    if (theme === "light") {
      this.popup.classList.remove("dark-theme");
      this.popup.classList.add("light-theme");
    } else {
      this.popup.classList.remove("light-theme");
      this.popup.classList.add("dark-theme");
    }
  }

  @boundMethod
  private closeHandler() {
    this.close();
  }

  @boundMethod
  public close(force = false) {
    if (!this.popup) return;

    if (force) {
      this.removePopup();
      return;
    }

    this.popup.style.animation = "popupDisappear 500ms";

    setTimeout(this.removePopup, 400);
  }

  @boundMethod
  private removePopup() {
    this.popup?.parentElement?.removeChild(this.popup);
    this.popup = null;
  }
}
