import layout from "./layout";
import Main from "./Main";
import Modal from "./Modal";

export default class QueryParams {
  private static title = "Query Params";
  private static queryParamsContainer: HTMLDivElement;
  private static formsParent: HTMLDivElement;
  private static newParamBtn: HTMLButtonElement;

  public static main() {
    Modal.main();
    Main.render("beforeend", layout.paramsLayout, Modal.modal);
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

    QueryParams.renderFoundParams();
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

  private static renderFoundParams() {
    const reqUrlArr = Main.reqEndpoint.value.split("?");
    if (reqUrlArr.length < 2) return;
    reqUrlArr[1].split("&").forEach((param) => {
      const [key, value] = param.split("=");
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
    const reqEndpointVal = Main.reqEndpoint.value;
    let queryParam = `?${paramKey}=${paramValue}`;
    if (reqEndpointVal.includes("?")) {
      queryParam = queryParam.replace("?", "&");
    }
    Main.reqEndpoint.value += queryParam;
    submitBtn.blur();
    submitBtn.textContent = "Edit";
    removeBtnContainer.style.display = "inline-block";
  }

  private static newParamHandler() {
    QueryParams.renderEmptyParam();
    QueryParams.newParamBtn.blur();
    console.log("Hello");
  }

  private static removeParamHandler(target: HTMLElement) {
    const currentForm = target.parentElement?.parentElement! as HTMLFormElement;
    const paramKeyEl = currentForm.querySelector(
      "input[name='param-key']"
    ) as HTMLInputElement;
    const paramValueEl = currentForm.querySelector(
      "input[name='param-value']"
    ) as HTMLInputElement;
    let param = `?${paramKeyEl.value}=${paramValueEl.value}`;
    const currentReqUrl = Main.reqEndpoint.value;
    const paramStartIndex = currentReqUrl.indexOf(paramKeyEl.value) - 1;
    if (currentReqUrl[paramStartIndex] === "&") {
      param = param.replace("?", "&");
      Main.reqEndpoint.value = currentReqUrl.replace(param, "?");
    } else {
      Main.reqEndpoint.value = currentReqUrl.replace(param, "");
    }
    QueryParams.formsParent.removeChild(currentForm);
  }
}
