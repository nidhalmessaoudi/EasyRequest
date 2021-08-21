import status from "http-status";

import layout from "./layout";
import Main from "./Main";
import ReqInfo from "./ReqInfo";

export default class Popup {
  private static popup: HTMLDivElement | null;
  private static body: HTMLDivElement;
  private static closeBtn: HTMLElement;

  public static main(state: boolean, info?: ReqInfo, error?: string) {
    Main.render("afterbegin", layout.popupLayout);
    Popup.popup = document.getElementById("popup-main") as HTMLDivElement;
    Popup.adjustTheme();
    if (state) {
      Main.render("afterbegin", layout.popupSuccessLayout, Popup.popup);
    } else {
      Main.render("afterbegin", layout.popupFailLayout, Popup.popup);
    }
    Popup.body = document.querySelector(".popup-body") as HTMLDivElement;
    if (!info) {
      Popup.renderError(error!);
    } else {
      Popup.renderInfo(info);
    }
    Popup.closeBtn = document.getElementById("popup-close") as HTMLElement;
    Popup.closeBtn.addEventListener("click", Popup.closeHandler);
  }

  private static renderInfo(info: ReqInfo) {
    for (const prop in info) {
      switch (prop) {
        case "Status":
          const statusCode = Number(info[prop]);
          info[prop] = `${statusCode} ${String(
            status[statusCode]
          ).toUpperCase()}`;
          break;
        case "Time":
          info[prop] = `${info[prop]} ms`;
          break;
        case "Size":
          info[prop] = `${info[prop]} KB`;
      }
      const popupInfo = document.createElement("span");
      popupInfo.classList.add("popup-info");
      popupInfo.textContent = `${prop}: ${info[prop]}`;
      Popup.body.appendChild(popupInfo);
    }
  }

  private static renderError(error: string) {
    const popupError = document.createElement("p");
    popupError.classList.add("popup-error");
    popupError.insertAdjacentHTML("afterbegin", error);
    Popup.body.appendChild(popupError);
  }

  public static adjustTheme() {
    if (!Popup.popup) return;
    const theme = localStorage.getItem("theme");
    if (theme === "light") {
      Popup.popup.classList.remove("dark-theme");
      Popup.popup.classList.add("light-theme");
    } else {
      Popup.popup.classList.remove("light-theme");
      Popup.popup.classList.add("dark-theme");
    }
  }

  private static closeHandler() {
    Popup.close();
  }

  public static close(force = false) {
    if (!Popup.popup) return;

    function removePopup() {
      Popup.popup?.parentElement?.removeChild(Popup.popup);
      Popup.popup = null;
    }
    if (force) {
      removePopup();
      return;
    }

    Popup.popup.style.animation = "popupDisappear 500ms";

    setTimeout(removePopup, 400);
  }
}
