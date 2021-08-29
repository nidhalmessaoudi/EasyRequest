import { boundMethod } from "autobind-decorator";

import CONFIG from "../utils/CONFIG";
import Main from "../Client/Main";
import render from "../Helpers/render";
import layout from "../layouts/layout";
import Modal from "./Modal";

export default class ReqHeaders extends Modal {
  public static self: ReqHeaders;
  public headers = Object.entries(CONFIG.headers);
  private title = "Headers";
  private controller: Main;
  private headersContainer!: HTMLDivElement;
  private formsParent!: HTMLDivElement;
  private newHeaderBtn!: HTMLButtonElement;

  private constructor(controller: Main) {
    super();
    this.controller = controller;
  }

  public static main(controller: Main) {
    if (!this.self) {
      this.self = new ReqHeaders(controller);
    }
    this.self.init();
    return this.self;
  }

  private init() {
    this.main();
    render("beforeend", layout.headersLayout, this.modal!);
    this.modalTitle.textContent = this.title;
    this.headersContainer = document.getElementById(
      "options-req"
    ) as HTMLDivElement;
    this.formsParent = document.getElementById(
      "header-forms"
    ) as HTMLDivElement;
    this.newHeaderBtn = document.getElementById(
      "header-form__new"
    ) as HTMLButtonElement;

    this.renderHeaders();
    this.renderEmptyHeader();

    this.headersContainer.addEventListener("submit", this.submitHandler);
    this.headersContainer.addEventListener("click", this.clickHandler);
  }

  @boundMethod
  private clickHandler(e: Event) {
    const clickedEl = e.target as HTMLElement;
    if (clickedEl.id === "header-form__new") {
      this.newHeaderHandler();
      return;
    }
    if (clickedEl.classList.contains("header-remove")) {
      this.removeHeaderHandler(clickedEl);
    }
  }

  private renderHeaders() {
    this.headers.forEach((header, i) => {
      const [key, value] = header;
      render("beforeend", layout.headerFormLayout, this.formsParent);
      const renderedForms = document.getElementsByClassName("add-header");
      const currentForm = renderedForms[renderedForms.length - 1];
      const keyInput = currentForm.querySelector(
        "input[name='header-key']"
      ) as HTMLInputElement;
      const valueInput = currentForm.querySelector(
        "input[name='header-value']"
      ) as HTMLInputElement;
      const editBtn = currentForm.querySelector(
        "button[name='header-toggle']"
      ) as HTMLButtonElement;
      const removeBtnContainer = currentForm.querySelector(
        ".header-remove__btn"
      ) as HTMLDivElement;
      keyInput.value = key;
      valueInput.value = value;
      keyInput.readOnly = true;
      if (i === 0) {
        valueInput.readOnly = true;
        editBtn.parentElement?.removeChild(editBtn);
        removeBtnContainer.parentElement?.removeChild(removeBtnContainer);
        return;
      }
      editBtn.textContent = "Edit";
      removeBtnContainer.style.display = "inline-block";
    });
  }

  private renderEmptyHeader() {
    render("beforeend", layout.headerFormLayout, this.formsParent);
  }

  @boundMethod
  private submitHandler(e: Event) {
    const submittedForm = e.target as HTMLFormElement;
    if (!submittedForm.classList.contains("add-header")) return;
    e.preventDefault();
    const headerKeyEl = submittedForm.querySelector(
      "input[name='header-key']"
    ) as HTMLInputElement;
    const headerValueEl = submittedForm.querySelector(
      "input[name='header-value']"
    ) as HTMLInputElement;
    const submitBtn = submittedForm.querySelector(
      "button[name='header-toggle']"
    ) as HTMLButtonElement;
    const removeBtnContainer = submittedForm.querySelector(
      ".header-remove__btn"
    ) as HTMLButtonElement;
    const headerKey = headerKeyEl.value.trim();
    const headerValue = headerValueEl.value.trim();
    if (!headerKey || !headerValue) return;
    if (
      this.headers.some((el) => el[0] === headerKey && el[1] === headerValue)
    ) {
      return;
    }
    const headerExist = this.headers.find((el) => el[0] === headerKey);
    if (headerExist) {
      if (submitBtn.textContent?.trim() === "Add") {
        submitBtn.disabled = true;
        render("beforeend", layout.formErrorLayout, submittedForm);
        const headerErrorEl = submittedForm.querySelector(
          ".option-error"
        )! as HTMLDivElement;
        const headerErrorBtn = submittedForm.querySelector(
          ".option-error__btn"
        )! as HTMLButtonElement;
        headerErrorBtn.textContent = "Already Assigned!";
        setTimeout(() => {
          submittedForm.removeChild(headerErrorEl);
          submitBtn.disabled = false;
        }, 2000);
        return;
      }
      this.editHeader(headerExist, headerValue);
      return;
    }
    this.headers.push([headerKey, headerValue]);
    submitBtn.blur();
    submitBtn.textContent = "Edit";
    removeBtnContainer.style.display = "inline-block";
    headerKeyEl.readOnly = true;
    this.onChange();
  }

  private newHeaderHandler() {
    const renderedForms = this.formsParent.querySelectorAll(".add-header");
    if (renderedForms.length) {
      const lastRenderedForm = renderedForms[renderedForms.length - 1];
      const formInputs: HTMLInputElement[] = [];
      formInputs.push(
        lastRenderedForm.querySelector(
          "input[name='header-key']"
        ) as HTMLInputElement
      );
      formInputs.push(
        lastRenderedForm.querySelector(
          "input[name='header-value']"
        ) as HTMLInputElement
      );
      let found = false;
      for (let input of formInputs) {
        if (input.value) continue;
        input.focus();
        found = true;
        break;
      }
      if (found) return;
    }
    this.renderEmptyHeader();
    this.newHeaderBtn.blur();
  }

  private removeHeaderHandler(target: HTMLElement) {
    const currentForm = target.parentElement?.parentElement! as HTMLFormElement;
    const headerKeyEl = currentForm.querySelector(
      "input[name='header-key']"
    ) as HTMLInputElement;
    const headerValueEl = currentForm.querySelector(
      "input[name='header-value']"
    ) as HTMLInputElement;
    const headerKey = headerKeyEl.value;
    const headerValue = headerValueEl.value;

    this.headers = this.headers.filter((header) => {
      return header[0] !== headerKey && header[1] !== headerValue;
    });

    this.formsParent.removeChild(currentForm);
    this.onChange();
  }

  private editHeader(oldHeaderObj: [string, string], newHeaderValue: string) {
    this.headers[this.headers.indexOf(oldHeaderObj)][1] = newHeaderValue;
    this.onChange();
  }

  public addHeader(headerName: string, headerValue: string) {
    this.headers.push([headerName, headerValue]);
  }

  public onChange() {
    this.controller.headers = {};
    this.headers.forEach((header) => {
      Main.self.headers[header[0]] = header[1];
    });
  }
}
