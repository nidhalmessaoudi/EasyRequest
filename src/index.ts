import JSONEditor from "jsoneditor";

import "./styles.css";
import "jsoneditor/dist/jsoneditor.css";

const config = {
  ROOT: document.getElementById("root")! as HTMLDivElement,
};

function render(position: InsertPosition, layout: string) {
  config.ROOT.insertAdjacentHTML(position, layout);
}

let reqForm: HTMLFormElement;
let reqType: HTMLSelectElement;
let reqEndpoint: HTMLInputElement;
let sendReqBtn: HTMLButtonElement;
let resultsEditor: JSONEditor;
function loadHandler() {
  render("afterbegin", initialLayout);
  render("beforeend", footerLayout);
  const resultContainer = document.getElementById("json-results")!;
  resultsEditor = new JSONEditor(resultContainer, {
    mode: "code",
  });
  resultsEditor.set({ Notice: "Results will appear here!" });
  reqForm = document.getElementById("req-form")! as HTMLFormElement;
  reqType = document.getElementById("req-type")! as HTMLSelectElement;
  reqEndpoint = document.getElementById("req-endpoint")! as HTMLInputElement;
  sendReqBtn = document.getElementById("send-req")! as HTMLButtonElement;
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
      mode: "no-cors",
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
    setTimeout(() => {
      sendReqBtn.style.backgroundColor = "#0d6efd";
      sendReqBtn.style.borderColor = "#0d6efd";
      sendReqBtn.disabled = false;
      sendReqBtn.textContent = "Send";
    }, 3000);
    console.error(err);
  }
}

const initialLayout = `
<div class="title-container">
    <h1 class="title">Easy Request</h1>
</div>
<div class="operation-container">
    <form id="req-form">
        <div class="input-group mb-3">
            <select class="type-selection" id="req-type">
                <option selected>GET</option>
                <option>POST</option>
                <option>PUT</option>
                <option>PATCH</option>
                <option>DELETE</option>
            </select>
            <input 
                type="text"
                class="form-control"
                placeholder="Put The Request Url Here..."
                id="req-endpoint"
                required
            >
            <button 
                type="submit"
                id="send-req"
                class="btn btn-primary"
            >
                Send
            </button>
        </div>
    </form>
</div>
<div class="result-container" id="json-results"></div>
`;

const footerLayout = `
<footer class="footer">
    <p>
        © Copyright ${new Date().getFullYear()}.
        Designed and Developed by <a href="https://github.com/nidhalmessaoudi" 
        target="_blank"
        >Nidhal Messaoudi</a>.
    </p>
</footer>
`;

window.addEventListener("load", loadHandler);
