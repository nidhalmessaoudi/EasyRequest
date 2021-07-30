import Main from "./Main";
import layout from "./layout";

export default class Modal {
  public static modal: HTMLDivElement;
  private static closeBtn: HTMLSpanElement;
  private static overlay: HTMLDivElement;

  public static main() {
    Main.render("afterbegin", layout.modalLayout);
    Main.render("afterbegin", layout.overlayLayout);
    Modal.modal = document.getElementById("modal") as HTMLDivElement;
    Modal.closeBtn = document.getElementById("modal-close") as HTMLSpanElement;
    Modal.overlay = document.getElementById("overlay") as HTMLDivElement;
    Modal.closeBtn.addEventListener("click", Modal.closeHandler);
    Modal.overlay.addEventListener("click", Modal.closeHandler);
    document.addEventListener("keydown", Modal.escapePressHandler);
  }

  private static escapePressHandler(e: KeyboardEvent) {
    if (e.key === "Escape") {
      e.preventDefault();
      Modal.closeHandler();
      document.removeEventListener("keydown", Modal.escapePressHandler);
    }
  }

  private static closeHandler() {
    Main.CONFIG.root.removeChild(Modal.modal);
    Main.CONFIG.root.removeChild(Modal.overlay);
  }
}
