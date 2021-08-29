import { boundMethod } from "autobind-decorator";

import "../styles/modal.css";

import CONFIG from "../utils/CONFIG";
import render from "../Helpers/render";
import layout from "../layouts/layout";

export default abstract class Modal {
  public modal!: HTMLDivElement | null;
  private overlay!: HTMLDivElement | null;
  public modalTitle!: HTMLHeadingElement;
  private closeBtn!: HTMLSpanElement;

  protected main() {
    render("afterbegin", layout.modalLayout);
    render("afterbegin", layout.overlayLayout);
    this.modal = document.getElementById("modal") as HTMLDivElement;
    this.adjustTheme();
    this.closeBtn = document.getElementById("modal-close") as HTMLSpanElement;
    this.modalTitle = document.getElementById(
      "modal-title"
    ) as HTMLHeadingElement;
    this.overlay = document.getElementById("overlay") as HTMLDivElement;
    this.closeBtn.addEventListener("click", this.closeHandler);
    this.overlay.addEventListener("click", this.closeHandler);
    document.addEventListener("keydown", this.escapePressHandler);
  }

  @boundMethod
  private escapePressHandler(e: KeyboardEvent) {
    if (e.key === "Escape") {
      e.preventDefault();
      this.closeHandler();
      document.removeEventListener("keydown", this.escapePressHandler);
    }
  }

  @boundMethod
  private closeHandler() {
    if (this.modal && this.overlay) {
      CONFIG.root.removeChild(this.modal);
      CONFIG.root.removeChild(this.overlay);
      this.modal = null;
      this.overlay = null;
    }
  }

  @boundMethod
  private adjustTheme() {
    const theme = localStorage.getItem("theme");
    if (theme === "light") {
      this.modal?.classList.add("light-theme");
    } else {
      this.modal?.classList.add("dark-theme");
    }
  }
}
