import layout from "./layout";
import Main from "./Main";
import Modal from "./Modal";

export default class ReqHeaders extends Modal {
  private static title = "Headers";
  private static headersContainer: HTMLDivElement;
  private static formsParent: HTMLDivElement;
  private static newHeaderBtn: HTMLButtonElement;
  public static headers = [
    ["User-Agent", "EasyRequest-Runtime/0.1.4-beta"],
    ["Accept", "*/*"],
  ];

  public static override main() {
    super.main();
    Main.render("beforeend", layout.headersLayout, Modal.modal);
    ReqHeaders.modalTitle.textContent = ReqHeaders.title;
    ReqHeaders.headersContainer = document.getElementById(
      "options-req"
    ) as HTMLDivElement;
    ReqHeaders.formsParent = document.getElementById(
      "header-forms"
    ) as HTMLDivElement;
    ReqHeaders.newHeaderBtn = document.getElementById(
      "header-form__new"
    ) as HTMLButtonElement;

    ReqHeaders.renderHeaders();
    ReqHeaders.renderEmptyHeader();

    ReqHeaders.headersContainer.addEventListener(
      "submit",
      ReqHeaders.submitHandler
    );
    ReqHeaders.headersContainer.addEventListener(
      "click",
      ReqHeaders.clickHandler
    );
  }

  private static clickHandler(e: Event) {
    const clickedEl = e.target as HTMLElement;
    if (clickedEl.id === "header-form__new") {
      ReqHeaders.newHeaderHandler();
      return;
    }
    if (clickedEl.classList.contains("header-remove")) {
      ReqHeaders.removeHeaderHandler(clickedEl);
    }
  }

  private static renderHeaders() {
    ReqHeaders.headers.forEach((header, i) => {
      const [key, value] = header;
      Main.render("beforeend", layout.headerFormLayout, ReqHeaders.formsParent);
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

  private static renderEmptyHeader() {
    Main.render("beforeend", layout.headerFormLayout, ReqHeaders.formsParent);
  }

  private static submitHandler(e: Event) {
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
      ReqHeaders.headers.some(
        (el) => el[0] === headerKey && el[1] === headerValue
      )
    ) {
      return;
    }
    const headerExist = ReqHeaders.headers.find((el) => el[0] === headerKey);
    if (headerExist) {
      if (submitBtn.textContent?.trim() === "Add") {
        submitBtn.disabled = true;
        Main.render("beforeend", layout.formErrorLayout, submittedForm);
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
      ReqHeaders.editHeader(headerExist, headerValue);
      return;
    }
    ReqHeaders.headers.push([headerKey, headerValue]);
    submitBtn.blur();
    submitBtn.textContent = "Edit";
    removeBtnContainer.style.display = "inline-block";
    headerKeyEl.readOnly = true;
    ReqHeaders.onChange();
  }

  private static newHeaderHandler() {
    const renderedForms =
      ReqHeaders.formsParent.querySelectorAll(".add-header");
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
    ReqHeaders.renderEmptyHeader();
    ReqHeaders.newHeaderBtn.blur();
  }

  private static removeHeaderHandler(target: HTMLElement) {
    const currentForm = target.parentElement?.parentElement! as HTMLFormElement;
    const headerKeyEl = currentForm.querySelector(
      "input[name='header-key']"
    ) as HTMLInputElement;
    const headerValueEl = currentForm.querySelector(
      "input[name='header-value']"
    ) as HTMLInputElement;
    const headerKey = headerKeyEl.value;
    const headerValue = headerValueEl.value;

    ReqHeaders.headers = ReqHeaders.headers.filter((header) => {
      return header[0] !== headerKey && header[1] !== headerValue;
    });

    ReqHeaders.formsParent.removeChild(currentForm);
    ReqHeaders.onChange();
  }

  private static editHeader(oldHeaderObj: string[], newHeaderValue: string) {
    ReqHeaders.headers[ReqHeaders.headers.indexOf(oldHeaderObj)][1] =
      newHeaderValue;
    ReqHeaders.onChange();
  }

  public static onChange() {
    Main.headers = {};
    ReqHeaders.headers.forEach((header) => {
      Main.headers[header[0]] = header[1];
    });
  }
}
