import render from "../Helpers/render";
import Popup from "../Popup/Popup";
import layout from "../layouts/layout";
import DOM from "./DOM";

type Theme = "light" | "dark";

export default class ThemeController {
  public static themeController: ThemeController;
  private theme!: Theme;
  private dom: DOM;

  private constructor(dom: DOM) {
    this.dom = dom;
  }

  public static main(dom: DOM) {
    if (!this.themeController) {
      this.themeController = new ThemeController(dom);
    }
    return this.themeController;
  }

  public adjustTheme(edit: boolean, popup: Popup) {
    this.theme = localStorage.getItem("theme") as Theme;
    if (edit) {
      this.theme === "light"
        ? localStorage.setItem("theme", "dark")
        : localStorage.setItem("theme", "light");
      this.theme = localStorage.getItem("theme") as Theme;
    }
    if (!this.theme) {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      this.theme = isDark ? "dark" : "light";
      localStorage.setItem("theme", this.theme);
    }
    if (this.dom.themeIcon)
      this.dom.switchTheme.removeChild(this.dom.themeIcon);
    if (this.theme === "light") {
      this.dom.switchTheme.insertAdjacentHTML(
        "afterbegin",
        layout.darkIconLayout
      );
      document.body.classList.remove("dark-theme");
      document.body.classList.add("light-theme");
      this.dom.reqEndpoint?.classList.remove("form-control__dark-theme");
      this.dom.reqType?.classList.remove("type-selection__dark-theme");
      const editorDarkStyle = document.getElementById("editor-dark");
      if (editorDarkStyle) {
        document.body.removeChild(editorDarkStyle);
      }
    } else {
      this.dom.switchTheme.insertAdjacentHTML(
        "afterbegin",
        layout.lightIconLayout
      );
      document.body.classList.remove("light-theme");
      document.body.classList.add("dark-theme");
      this.dom.reqType?.classList.add("type-selection__dark-theme");
      this.dom.reqEndpoint?.classList.add("form-control__dark-theme");
      render("beforebegin", layout.editorDarkStyle);
    }
    this.dom.themeIcon = document.getElementById("bi-theme") as HTMLElement;
    popup?.adjustTheme();
  }
}
