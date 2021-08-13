import JSONEditor from "jsoneditor";

import layout from "./layout";
import Main from "./Main";
import Modal from "./Modal";

type BodyTypes = "json" | "other";

export default class Body extends Modal {
  private static title = "Body";
  private static overviewEl: HTMLDivElement | null;
  private static understood = false;
  private static editorContainer: HTMLDivElement;
  private static activeEditor: BodyTypes;
  private static jsonEditor: JSONEditor;
  private static theOtherEditor: HTMLTextAreaElement;
  private static editorContent: { type?: BodyTypes; value?: string } = {};
  private static saveBodyBtn: HTMLButtonElement;

  public static override main() {
    super.main();
    Body.modalTitle.textContent = Body.title;
    if (Body.understood) {
      Body.proceedHandler();
      return;
    }
    Main.render("beforeend", layout.bodyOverviewLayout, Body.modal);
    Body.overviewEl = Body.modal.querySelector(".overview") as HTMLDivElement;
    const bodyProceed = document.getElementById("body-proceed");
    bodyProceed?.addEventListener("click", Body.proceedHandler);
  }

  private static proceedHandler() {
    if (Body.overviewEl) {
      Body.understood = true;
      Body.modal.removeChild(Body.overviewEl);
      Body.overviewEl = null;
    }
    Main.render("beforeend", layout.bodyLayout, Body.modal);
    Body.editorContainer = document.getElementById(
      "body-editor"
    ) as HTMLDivElement;
    Body.theOtherEditor = document.getElementById(
      "req-body__content"
    ) as HTMLTextAreaElement;

    if (!Body.editorContent.type || Body.editorContent.type === "json") {
      Body.editorContainer.innerHTML = "";
      Body.jsonEditor = new JSONEditor(Body.editorContainer, {
        mode: "code",
      });
    }
    Body.activeEditor = "json";
    if (Body.editorContent.type) {
      switch (Body.editorContent.type) {
        case "json":
          Body.jsonEditor.set(Body.editorContent.value!);
          Body.activeEditor = "json";
          break;
        case "other":
          Body.theOtherEditor.value = Body.editorContent.value!;
          Body.activeEditor = "other";
          Body.toggleActiveType();
      }
    }
    const bodyTypeSwitch = document.getElementById("body-type__switch");
    bodyTypeSwitch?.addEventListener("click", Body.bodyTypeSwitchHandler);
    Body.saveBodyBtn = document.getElementById(
      "save-body__btn"
    ) as HTMLButtonElement;
    Body.saveBodyBtn.addEventListener("click", Body.saveBodyHandler);
  }

  private static bodyTypeSwitchHandler(e: Event) {
    const clicked = e.target as HTMLSpanElement;
    if (clicked.tagName !== "SPAN") return;
    switch (clicked.id) {
      case "json__body-type":
        if (Body.activeEditor === "json") return;
        Body.editorContainer.innerHTML = "";
        Body.jsonEditor = new JSONEditor(Body.editorContainer, {
          mode: "code",
        });
        if (Body.editorContent.type === "json") {
          Body.jsonEditor.set(Body.editorContent.value!);
        }
        Body.activeEditor = "json";
        break;
      case "other__body-type":
        if (Body.activeEditor === "other") return;
        Body.editorContainer.innerHTML = "";
        Body.editorContainer.appendChild(Body.theOtherEditor);
        if (Body.editorContent.type === "other") {
          Body.theOtherEditor.value = Body.editorContent.value!;
        }
        Body.activeEditor = "other";
        break;
    }

    Body.toggleActiveType();
  }

  private static saveBodyHandler() {
    switch (Body.activeEditor) {
      case "json":
        Body.editorContent.type = "json";
        Body.editorContent.value = Body.jsonEditor.get();
        break;
      case "other":
        Body.editorContent.type = "other";
        Body.editorContent.value = Body.theOtherEditor.value;
        break;
    }
    Main.body = Body.editorContent.value!;
    Body.saveBodyBtn.textContent = "Saved";
    Body.saveBodyBtn.disabled = true;
    setTimeout(() => {
      Body.saveBodyBtn.textContent = "Save";
      Body.saveBodyBtn.disabled = false;
    }, 500);
  }

  private static toggleActiveType() {
    document
      .querySelectorAll(".body-type")
      .forEach((el) => el.classList.toggle("body-type__active"));
  }
}
