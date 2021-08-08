import JSONEditor from "jsoneditor";

import "./styles.css";
import "jsoneditor/dist/jsoneditor.min.css";

import layout from "./layout";

import QueryParams from "./QueryParams";
import ReqHeaders from "./Headers";
import Body from "./Body";

export default class Main {
  public static CONFIG = {
    root: document.getElementById("root")! as HTMLDivElement,
  };
  public static reqEndpoint: HTMLInputElement;
  public static headers: { [headerName: string]: string };
  private static reqForm: HTMLFormElement;
  private static reqType: HTMLSelectElement;
  private static reqOptionsBar: HTMLDivElement;
  private static sendReqBtn: HTMLButtonElement;
  private static resultsEditor: JSONEditor;
  private static author: HTMLAnchorElement;
  private static switchTheme: HTMLSpanElement;
  private static themeIcon: HTMLElement;

  public static main() {
    window.addEventListener("load", Main.loadHandler);
    ReqHeaders.onChange();
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
      Main.author?.classList.remove("dark-theme");
      Main.author?.classList.add("light-theme");
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
      Main.author?.classList.remove("light-theme");
      Main.author?.classList.add("dark-theme");
      Main.reqType?.classList.add("type-selection__dark-theme");
      Main.reqEndpoint?.classList.add("form-control__dark-theme");
      Main.render("beforebegin", layout.editorDarkStyle);
    }
    Main.themeIcon = document.querySelector(".bi") as HTMLElement;
  }

  private static loadHandler() {
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
    Main.author = document.getElementById("author") as HTMLAnchorElement;
    Main.switchTheme = document.getElementById(
      "theme-switch"
    ) as HTMLSpanElement;
    const resultContainer = document.getElementById("json-results")!;
    Main.adjustTheme(false);
    Main.resultsEditor = new JSONEditor(resultContainer, {
      mode: "code",
    });
    Main.resultsEditor.set({ Notice: "Results will appear here!" });
    Main.switchTheme.addEventListener("click", () => Main.adjustTheme(true));
    Main.reqForm.addEventListener("submit", Main.submitHandler);
    window.addEventListener("storage", () => Main.adjustTheme(false));
    Main.reqOptionsBar.addEventListener("click", Main.optionsClickHandler);
  }

  private static async submitHandler(e: Event) {
    try {
      e.preventDefault();

      Main.sendReqBtn.textContent = "Sending";
      Main.sendReqBtn.disabled = true;
      Main.resultsEditor.set({ Notice: "Loading data..." });
      console.log(Main.headers);
      const req = await fetch(Main.reqEndpoint.value, {
        method: Main.reqType.value,
        headers: Main.headers,
      });

      const res = await req.json();

      Main.sendReqBtn.textContent = "Send";
      Main.sendReqBtn.disabled = false;
      Main.resultsEditor.set(res);
      Main.resultsEditor.focus();
    } catch (err) {
      Main.sendReqBtn.textContent = "Failed";
      Main.sendReqBtn.style.backgroundColor = "#dc3545";
      Main.sendReqBtn.style.borderColor = "#dc3545";
      Main.resultsEditor.set({ Notice: "failed to load data!" });
      setTimeout(() => {
        Main.sendReqBtn.style.backgroundColor = "#0d6efd";
        Main.sendReqBtn.style.borderColor = "#0d6efd";
        Main.sendReqBtn.disabled = false;
        Main.sendReqBtn.textContent = "Send";
        Main.resultsEditor.set({ Notice: "Results will appear here!" });
      }, 3000);
      console.error(err);
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
    Main.adjustModalTheme();
  }

  private static adjustModalTheme() {
    const theme = localStorage.getItem("theme");
    const modal = document.getElementById("modal");
    if (theme === "dark") {
      modal?.classList.add("dark-theme");
    } else {
      modal?.classList.add("light-theme");
    }
  }
}
