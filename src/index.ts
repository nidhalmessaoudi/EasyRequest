import JSONEditor from "jsoneditor";

import "./styles.css";
import "jsoneditor/dist/jsoneditor.min.css";

import layout from "./layout";

const config = {
  ROOT: document.getElementById("root")! as HTMLDivElement,
};

function render(position: InsertPosition, layout: string) {
  config.ROOT.insertAdjacentHTML(position, layout);
}

function adjustTheme(edit: boolean) {
  let theme = localStorage.getItem("theme");
  if (edit) {
    theme === "light"
      ? localStorage.setItem("theme", "dark")
      : localStorage.setItem("theme", "light");
  }
  if (!theme) {
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    theme = isDark ? "dark" : "light";
    localStorage.setItem("theme", theme);
    return;
  }
  if (theme === "light") {
    document.body.classList.remove("dark-theme");
    document.getElementById("author")?.classList.remove("dark-theme");
    reqEndpoint?.classList.remove("form-control__dark-theme");
    reqType?.classList.remove("type-selection__dark-theme");
    const editorDarkStyle = document.getElementById("editor-dark");
    if (editorDarkStyle) {
      document.body.removeChild(editorDarkStyle);
    }
    return;
  }
  document.body.classList.add("dark-theme");
  document.getElementById("author")?.classList.add("dark-theme");
  reqEndpoint?.classList.add("form-control__dark-theme");
  reqType?.classList.add("type-selection__dark-theme");
  render("beforebegin", layout.editorDarkStyle);
}

let reqForm: HTMLFormElement;
let reqType: HTMLSelectElement;
let reqEndpoint: HTMLInputElement;
let sendReqBtn: HTMLButtonElement;
let resultsEditor: JSONEditor;
let switchTheme: HTMLHeadingElement;
function loadHandler() {
  render("afterbegin", layout.initialLayout);
  render("beforeend", layout.footerLayout);
  adjustTheme(false);
  const resultContainer = document.getElementById("json-results")!;
  resultsEditor = new JSONEditor(resultContainer, {
    mode: "code",
  });
  resultsEditor.set({ Notice: "Results will appear here!" });
  reqForm = document.getElementById("req-form")! as HTMLFormElement;
  reqType = document.getElementById("req-type")! as HTMLSelectElement;
  reqEndpoint = document.getElementById("req-endpoint")! as HTMLInputElement;
  sendReqBtn = document.getElementById("send-req")! as HTMLButtonElement;
  switchTheme = document.getElementById("switch-theme") as HTMLHeadingElement;
  switchTheme.addEventListener("click", () => adjustTheme(true));
  reqForm.addEventListener("submit", submitHandler);
}

async function submitHandler(e: Event) {
  try {
    e.preventDefault();

    sendReqBtn.textContent = "Sending";
    sendReqBtn.disabled = true;
    resultsEditor.set({ Notice: "Loading data..." });

    const req = await fetch(reqEndpoint.value, {
      method: reqType.value,
    });

    const res = await req.json();

    sendReqBtn.textContent = "Send";
    sendReqBtn.disabled = false;
    resultsEditor.set(res);
    resultsEditor.focus();
  } catch (err) {
    sendReqBtn.textContent = "Failed";
    sendReqBtn.style.backgroundColor = "#dc3545";
    sendReqBtn.style.borderColor = "#dc3545";
    resultsEditor.set({ Notice: "failed to load data!" });
    setTimeout(() => {
      sendReqBtn.style.backgroundColor = "#0d6efd";
      sendReqBtn.style.borderColor = "#0d6efd";
      sendReqBtn.disabled = false;
      sendReqBtn.textContent = "Send";
      resultsEditor.set({ Notice: "Results will appear here!" });
    }, 3000);
    console.error(err);
  }
}

window.addEventListener("load", loadHandler);
