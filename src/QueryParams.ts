import layout from "./layout";
import Main from "./Main";
import Modal from "./Modal";

interface queryParam {
  key: string;
  value: string;
}

export default class QueryParams extends Modal {
  private static title = "Query Params";
  private static queryParams: queryParam[] = [];
  private static queryParamsContainer: HTMLDivElement;
  private static formsParent: HTMLDivElement;
  private static newParamBtn: HTMLButtonElement;

  public static override main() {
    super.main();
    Main.render("beforeend", layout.paramsLayout, QueryParams.modal);
    const modalTitle = document.getElementById("modal-title")!;
    modalTitle.textContent = QueryParams.title;
    QueryParams.queryParamsContainer = document.getElementById(
      "options-req"
    ) as HTMLDivElement;
    QueryParams.formsParent = document.getElementById(
      "param-forms"
    ) as HTMLDivElement;
    QueryParams.newParamBtn = document.getElementById(
      "param-form__new"
    )! as HTMLButtonElement;

    QueryParams.renderParams();
    QueryParams.renderEmptyParam();

    QueryParams.queryParamsContainer.addEventListener(
      "submit",
      QueryParams.submitHandler
    );
    QueryParams.queryParamsContainer.addEventListener(
      "click",
      QueryParams.clickHandler
    );
  }

  private static clickHandler(e: Event) {
    const clickedEl = e.target as HTMLElement;
    if (clickedEl.id === "param-form__new") {
      QueryParams.newParamHandler();
      return;
    }
    if (clickedEl.classList.contains("param-remove")) {
      QueryParams.removeParamHandler(clickedEl);
    }
  }

  private static pushFoundParams() {
    QueryParams.queryParams = [];
    const reqUrlArr = Main.reqEndpoint.value.split("?");
    if (reqUrlArr.length < 2) return;
    reqUrlArr[1].split("&").forEach((param) => {
      const [key, value] = param.split("=");
      QueryParams.queryParams.push({ key, value });
    });
  }

  private static renderParams() {
    QueryParams.pushFoundParams();
    QueryParams.queryParams.forEach((param) => {
      const { key, value } = param;
      Main.render("beforeend", layout.paramFormLayout, QueryParams.formsParent);
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

  private static renderEmptyParam() {
    Main.render("beforeend", layout.paramFormLayout, QueryParams.formsParent);
  }

  private static submitHandler(e: Event) {
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
    const paramKey = paramKeyEl.value;
    const paramValue = paramValueEl.value;
    if (!paramKey || !paramValue) return;
    if (
      QueryParams.queryParams.some(
        (el) => el.key === paramKey && el.value === paramValue
      )
    ) {
      return;
    }
    const paramExist = QueryParams.queryParams.find(
      (el) => el.key === paramKey
    );
    if (paramExist) {
      if (submitBtn.textContent?.trim() === "Add") {
        submitBtn.disabled = true;
        Main.render("beforeend", layout.paramFormErrorLayout, submittedForm);
        const paramErrorEl = submittedForm.querySelector(
          ".param-error"
        )! as HTMLDivElement;
        const paramErrorBtn = submittedForm.querySelector(
          ".param-error__btn"
        )! as HTMLButtonElement;
        paramErrorBtn.textContent = "Already Assigned!";
        setTimeout(() => {
          submittedForm.removeChild(paramErrorEl);
          submitBtn.disabled = false;
        }, 2000);
        return;
      }
      QueryParams.editParam(paramExist, paramValue);
      return;
    }
    QueryParams.queryParams.push({ key: paramKey, value: paramValue });
    submitBtn.blur();
    submitBtn.textContent = "Edit";
    removeBtnContainer.style.display = "inline-block";
    paramKeyEl.readOnly = true;
    QueryParams.onChange();
  }

  private static newParamHandler() {
    const renderedForms =
      QueryParams.formsParent.querySelectorAll(".add-param");
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
    QueryParams.renderEmptyParam();
    QueryParams.newParamBtn.blur();
  }

  private static removeParamHandler(target: HTMLElement) {
    const currentForm = target.parentElement?.parentElement! as HTMLFormElement;
    const paramKeyEl = currentForm.querySelector(
      "input[name='param-key']"
    ) as HTMLInputElement;
    const paramValueEl = currentForm.querySelector(
      "input[name='param-value']"
    ) as HTMLInputElement;
    const paramKey = paramKeyEl.value;
    const paramValue = paramValueEl.value;

    QueryParams.queryParams = QueryParams.queryParams.filter((param) => {
      return param.key !== paramKey && param.value !== paramValue;
    });

    QueryParams.formsParent.removeChild(currentForm);
    QueryParams.onChange();
  }

  private static editParam(oldParamObj: queryParam, newParamValue: string) {
    QueryParams.queryParams[
      QueryParams.queryParams.indexOf(oldParamObj)
    ].value = newParamValue;
    QueryParams.onChange();
  }

  private static onChange() {
    const reqArr = Main.reqEndpoint.value.split("?");
    Main.reqEndpoint.value = reqArr[0];
    if (!QueryParams.queryParams.length) return;
    const queryString =
      "?" +
      QueryParams.queryParams
        .map((param) => `${param.key}=${param.value}`)
        .join("&");
    Main.reqEndpoint.value += queryString;
  }
}
