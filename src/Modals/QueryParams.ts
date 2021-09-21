import { boundMethod } from "autobind-decorator";

import DOM from "../Client/DOM";
import render from "../Helpers/render";
import ERArrayDelegate from "../Interfaces/ERArrayDelegate";
import layout from "../layouts/layout";
import ERArray from "../utils/ERArray";
import Modal from "./Modal";

interface queryParam {
  key: string;
  value: string;
}

export default class QueryParams
  extends Modal
  implements ERArrayDelegate<queryParam>
{
  public static self: QueryParams;
  private title = "Query Params";
  private dom: DOM;
  private queryParams = new ERArray<queryParam>();
  private queryParamsContainer!: HTMLDivElement;
  private formsParent!: HTMLDivElement;
  private newParamBtn!: HTMLButtonElement;

  private constructor(dom: DOM) {
    super();
    this.dom = dom;
  }

  public static main(dom: DOM) {
    if (!this.self) {
      this.self = new QueryParams(dom);
    }
    this.self.init();
    return this.self;
  }

  private init() {
    this.queryParams.delegate = this;
    this.main();
    this.modalTitle.textContent = this.title;
    render("beforeend", layout.paramsLayout, this.modal!);
    this.queryParamsContainer = document.getElementById(
      "options-req"
    ) as HTMLDivElement;
    this.formsParent = document.getElementById("param-forms") as HTMLDivElement;
    this.newParamBtn = document.getElementById(
      "param-form__new"
    )! as HTMLButtonElement;

    this.renderParams();
    this.renderEmptyParam();

    this.queryParamsContainer.addEventListener("submit", this.submitHandler);
    this.queryParamsContainer.addEventListener("click", this.clickHandler);
  }

  @boundMethod
  private clickHandler(e: Event) {
    const clickedEl = e.target as HTMLElement;
    if (clickedEl.id === "param-form__new") {
      this.newParamHandler();
      return;
    }
    if (clickedEl.classList.contains("param-remove")) {
      this.removeParamHandler(clickedEl);
    }
  }

  private pushFoundParams() {
    this.queryParams.clear();
    const reqUrlArr = this.dom.reqEndpoint.value.split("?");
    if (reqUrlArr.length < 2) return;
    reqUrlArr[1].split("&").forEach((param) => {
      const [key, value] = param.split("=");
      this.queryParams.push({ key, value });
    });
  }

  private renderParams() {
    this.pushFoundParams();
    this.queryParams.data.forEach((param) => {
      const { key, value } = param;
      render("beforeend", layout.paramFormLayout, this.formsParent);
      const renderedForms = document.getElementsByClassName("add-param");
      const currentForm = renderedForms[renderedForms.length - 1];
      const keyInput = currentForm.querySelector(
        "input[name='param-key']"
      ) as HTMLInputElement;
      const valueInput = currentForm.querySelector(
        "input[name='param-value']"
      ) as HTMLInputElement;
      const editBtn = currentForm.querySelector(
        "button[name='param-toggle']"
      ) as HTMLButtonElement;
      const removeBtnContainer = currentForm.querySelector(
        ".param-remove__btn"
      ) as HTMLDivElement;
      editBtn.textContent = "Edit";
      removeBtnContainer.style.display = "inline-block";
      keyInput.value = key;
      valueInput.value = value;
      keyInput.readOnly = true;
    });
  }

  private renderEmptyParam() {
    render("beforeend", layout.paramFormLayout, this.formsParent);
  }

  @boundMethod
  private submitHandler(e: Event) {
    const submittedForm = e.target as HTMLFormElement;
    if (!submittedForm.classList.contains("add-param")) return;
    e.preventDefault();
    const paramKeyEl = submittedForm.querySelector(
      "input[name='param-key']"
    ) as HTMLInputElement;
    const paramValueEl = submittedForm.querySelector(
      "input[name='param-value']"
    ) as HTMLInputElement;
    const submitBtn = submittedForm.querySelector(
      "button[name='param-toggle']"
    ) as HTMLButtonElement;
    const removeBtnContainer = submittedForm.querySelector(
      ".param-remove__btn"
    ) as HTMLButtonElement;
    const paramKey = paramKeyEl.value.trim();
    const paramValue = paramValueEl.value.trim();
    if (!paramKey || !paramValue) return;
    if (
      this.queryParams.data.some(
        (el) => el.key === paramKey && el.value === paramValue
      )
    ) {
      return;
    }
    const paramExist = this.queryParams.data.find((el) => el.key === paramKey);
    if (paramExist) {
      if (submitBtn.textContent?.trim() === "Add") {
        submitBtn.disabled = true;
        render("beforeend", layout.formErrorLayout, submittedForm);
        const paramErrorEl = submittedForm.querySelector(
          ".option-error"
        )! as HTMLDivElement;
        const paramErrorBtn = submittedForm.querySelector(
          ".option-error__btn"
        )! as HTMLButtonElement;
        paramErrorBtn.textContent = "Already Assigned!";
        setTimeout(() => {
          submittedForm.removeChild(paramErrorEl);
          submitBtn.disabled = false;
        }, 2000);
        return;
      }
      this.editParam(paramExist, paramValue);
      return;
    }
    this.queryParams.push({ key: paramKey, value: paramValue });
    submitBtn.blur();
    submitBtn.textContent = "Edit";
    removeBtnContainer.style.display = "inline-block";
    paramKeyEl.readOnly = true;
  }

  private newParamHandler() {
    const renderedForms = this.formsParent.querySelectorAll(".add-param");
    if (renderedForms.length) {
      const lastRenderedForm = renderedForms[renderedForms.length - 1];
      const formInputs: HTMLInputElement[] = [];
      formInputs.push(
        lastRenderedForm.querySelector(
          "input[name='param-key']"
        ) as HTMLInputElement
      );
      formInputs.push(
        lastRenderedForm.querySelector(
          "input[name='param-value']"
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
    this.renderEmptyParam();
    this.newParamBtn.blur();
  }

  private removeParamHandler(target: HTMLElement) {
    const currentForm = target.parentElement?.parentElement! as HTMLFormElement;
    const paramKeyEl = currentForm.querySelector(
      "input[name='param-key']"
    ) as HTMLInputElement;
    const paramValueEl = currentForm.querySelector(
      "input[name='param-value']"
    ) as HTMLInputElement;
    const paramKey = paramKeyEl.value;
    const paramValue = paramValueEl.value;

    this.queryParams.init(
      ...this.queryParams.data.filter((param) => {
        return param.key !== paramKey && param.value !== paramValue;
      })
    );

    this.formsParent.removeChild(currentForm);
  }

  private editParam(oldParamObj: queryParam, newParamValue: string) {
    this.queryParams.update(oldParamObj, {
      key: oldParamObj.key,
      value: newParamValue,
    });
  }

  onChange(sender: ERArray<queryParam>) {
    const reqArr = this.dom.reqEndpoint.value.split("?");
    this.dom.reqEndpoint.value = reqArr[0];
    if (!sender.data.length) return;
    const queryString =
      "?" + sender.data.map((param) => `${param.key}=${param.value}`).join("&");
    this.dom.reqEndpoint.value += queryString;
  }
}
