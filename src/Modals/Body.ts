import { boundMethod } from "autobind-decorator";

import JSONEditor from "jsoneditor";

import Main from "../Client/Main";
import render from "../Helpers/render";
import layout from "../layouts/layout";
import Modal from "./Modal";

type BodyTypes = "json" | "other";

export default class Body extends Modal {
  public static self: Body;
  private title = "Body";
  private controller: Main;
  private overviewEl!: HTMLDivElement | null;
  private understood = false;
  private editorContainer!: HTMLDivElement;
  private activeEditor!: BodyTypes;
  private jsonEditor!: JSONEditor;
  private theOtherEditor!: HTMLTextAreaElement;
  private editorContent: { type?: BodyTypes; value?: string } = {};
  private saveBodyBtn!: HTMLButtonElement;

  private constructor(controller: Main) {
    super();
    this.controller = controller;
  }

  public static main(controller: Main) {
    if (!this.self) {
      this.self = new Body(controller);
    }
    this.self.init();
    return this.self;
  }

  private init() {
    this.main();
    this.modalTitle.textContent = this.title;
    if (this.understood) {
      this.proceedHandler();
      return;
    }
    render("beforeend", layout.bodyOverviewLayout, this.modal!);
    this.overviewEl = this.modal!.querySelector(".overview") as HTMLDivElement;
    const bodyProceed = document.getElementById("body-proceed");
    bodyProceed?.addEventListener("click", this.proceedHandler);
  }

  @boundMethod
  private proceedHandler() {
    if (this.overviewEl) {
      this.understood = true;
      this.modal!.removeChild(this.overviewEl);
      this.overviewEl = null;
    }
    render("beforeend", layout.bodyLayout, this.modal!);
    this.editorContainer = document.getElementById(
      "body-editor"
    ) as HTMLDivElement;
    this.theOtherEditor = document.getElementById(
      "req-body__content"
    ) as HTMLTextAreaElement;

    if (!this.editorContent.type || this.editorContent.type === "json") {
      this.editorContainer.innerHTML = "";
      this.jsonEditor = new JSONEditor(this.editorContainer, {
        mode: "code",
      });
    }
    this.activeEditor = "json";
    if (this.editorContent.type) {
      switch (this.editorContent.type) {
        case "json":
          this.jsonEditor.set(this.editorContent.value!);
          this.activeEditor = "json";
          break;
        case "other":
          this.theOtherEditor.value = this.editorContent.value!;
          this.activeEditor = "other";
          this.toggleActiveType();
      }
    }
    const bodyTypeSwitch = document.getElementById("body-type__switch");
    bodyTypeSwitch?.addEventListener("click", this.bodyTypeSwitchHandler);
    this.saveBodyBtn = document.getElementById(
      "save-body__btn"
    ) as HTMLButtonElement;
    this.saveBodyBtn.addEventListener("click", this.saveBodyHandler);
  }

  @boundMethod
  private bodyTypeSwitchHandler(e: Event) {
    const clicked = e.target as HTMLSpanElement;
    if (clicked.tagName !== "SPAN") return;
    switch (clicked.id) {
      case "json__body-type":
        if (this.activeEditor === "json") return;
        this.editorContainer.innerHTML = "";
        this.jsonEditor = new JSONEditor(this.editorContainer, {
          mode: "code",
        });
        if (this.editorContent.type === "json") {
          this.jsonEditor.set(this.editorContent.value!);
        }
        this.activeEditor = "json";
        break;
      case "other__body-type":
        if (this.activeEditor === "other") return;
        this.editorContainer.innerHTML = "";
        this.editorContainer.appendChild(this.theOtherEditor);
        if (this.editorContent.type === "other") {
          this.theOtherEditor.value = this.editorContent.value!;
        }
        this.activeEditor = "other";
        break;
    }

    this.toggleActiveType();
  }

  @boundMethod
  private saveBodyHandler() {
    const self = this;
    switch (this.activeEditor) {
      case "json":
        const jsonBody = this.getJSON(this.jsonEditor);
        if (!jsonBody.parsed) {
          this.saveBodyBtn.textContent = "Failed";
          this.saveBodyBtn.classList.remove("btn-primary");
          this.saveBodyBtn.classList.add("btn-outline-danger");
          this.saveBodyBtn.disabled = true;
          reset(1.5, true);
          return;
        }
        if (Object.keys(jsonBody.data).length === 0) return;
        this.editorContent.type = "json";
        this.editorContent.value = jsonBody.data;
        this.controller.headers["Content-Type"] = "application/json";
        break;
      case "other":
        this.editorContent.type = "other";
        if (this.theOtherEditor.value.trim() === "") return;
        this.editorContent.value = this.theOtherEditor.value;
        break;
    }
    this.controller.body = JSON.stringify(this.editorContent.value!);
    this.saveBodyBtn.textContent = "Saved";
    this.saveBodyBtn.disabled = true;
    reset(1);
    function reset(after: number, afterFail = false) {
      setTimeout(() => {
        if (afterFail) {
          self.saveBodyBtn.classList.remove("btn-outline-danger");
          self.saveBodyBtn.classList.add("btn-primary");
        }
        self.saveBodyBtn.textContent = "Save";
        self.saveBodyBtn.disabled = false;
      }, after * 1000);
    }
  }

  private toggleActiveType() {
    document
      .querySelectorAll(".body-type")
      .forEach((el) => el.classList.toggle("body-type__active"));
  }

  private getJSON(editor: JSONEditor) {
    try {
      const json = editor.get();
      return {
        parsed: true,
        data: json,
      };
    } catch {
      return {
        parsed: false,
        data: null,
      };
    }
  }
}
