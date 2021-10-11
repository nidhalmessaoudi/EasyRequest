export default {
  initialLayout: `
    <div id="switch" class="theme-switch__container">
      <span class="icon-theme" id="theme-switch"></span>
    </div>
    <div class="title-container">
        <h1 class="title">Easy Request</h1>
    </div>
    <div class="main">
    <div class="operation-container">
        <form id="req-form">
            <div class="input-group mb-3">
            <select 
                class="type-selection"
                id="req-type"
            >
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
                title="Send Request"
            >
                Send
            </button>
            </div>
        </form>
    </div>
    <div id="options-bar" class="req-options-bar">
        <span class="req-option" title="Query Params" data-name="params">Params</span>
        <span class="req-option" title="Headers" data-name="headers">Headers</span>
        <span class="req-option" title="Body" data-name="body">Body</span>
    </div>
    <div class="result-container" id="json-results"></div>
    </div>
    <div class="new-tab__container" title="New Tab">
      <button id="new-tab" class="mdc-fab" aria-label="New Tab">
        <i class="bi bi-plus"></i>
      </button>
    </div>
  `,

  footerLayout: `
    <footer class="footer">
        <p>
            © Copyright ${new Date().getFullYear()}.
            Designed and Developed by <a
            id="author"
            class="light-theme"
            href="https://github.com/nidhalmessaoudi" 
            target="_blank"
            >Nidhal Messaoudi</a>.
        </p>
    </footer>
    `,
  editorDarkStyle: `
    <style id="editor-dark">
      .ace_content {
        background-color: #3a3b3c;
      }
    
      .jsoneditor-statusbar,
      .ace_gutter {
        background-color: #3a3b3c !important;
        color: #ffffff !important;
      }
    </style>
  `,

  lightIconLayout: `
    <i id="bi-theme" class="bi bi-brightness-high" ></i>
  `,
  darkIconLayout: `
    <i id="bi-theme" class="bi bi-moon"></i>
  `,

  modalLayout: `
    <div id="modal" class="modal-main">
      <div class="modal-top">
        <h2 id="modal-title" class="modal-brand"></h2>
        <span class="close-icon" id="modal-close">&times;</span>
      </div>
    </div>
  `,

  overlayLayout: `
    <div id="overlay"></div>
  `,

  paramsLayout: `
    <div class="overview">
      <b>Usage:</b>
      <ul>
        <li>
          You can add your custom query params from here
          as <code>Key -> Value</code> pairs.
        </li>
        <li>
          They will be added and formatted directly to your request url
          as <code>?Key=Value&</code>.
        </li>
        <li>
          You can also put your query params directly in the request url <br>
          and they will appear here as well to be able to edit them if you want.
        </li>
      </ul>
    </div>
    <div class="req-options" id="options-req">
      <div id="param-forms"></div>
      <div class="new-btn__container">
        <button 
          type="button" 
          class="param-btn btn btn-secondary"
          id="param-form__new"
        >
          New
        </button>
      </div>
    </div>
  `,

  paramFormLayout: `
  <form class="add add-param row">
    <div class="col-auto">
      <input
        type="text"
        placeholder="Key"
        name="param-key"
        class="form-control"
      />
    </div>
    <div class="col-auto">
      <input
        type="text"
        placeholder="Value"
        name="param-value"
        class="form-control"
      />
    </div>
    <div class="col-auto">
      <button 
        type="submit" 
        name="param-toggle" 
        class="btn btn-outline-secondary"
      >
      Add
      </button>
    </div>
    <div class="col-auto remove-btn param-remove__btn">
      <button
        type="button"
        name="param-remove"
        class="param-remove btn btn-outline-danger"
      >
      Remove
      </button>
    </div>
  </form>
  `,

  formErrorLayout: `
    <div class="option-error col-auto">
        <button class="option-error__btn btn btn-outline-danger" disabled></button>
    </div>
  `,

  headersLayout: `
    <div class="overview">
      <b>Usage:</b>
      <ul>
        <li>
          You can add your custom headers from here
          as <code>Header-Name -> Header-Value</code> pairs. <br> E.g: 
          <code>Content-Type -> application/json</code>.
        </li>
        <li>
          They will be added and formatted
          directly to the request headers.
        </li>
      </ul>
    </div>
    <div class="req-options" id="options-req">
      <div id="header-forms"></div>
      <div class="new-btn__container">
        <button 
          type="button" 
          class="header-btn btn btn-secondary"
          id="header-form__new"
        >
          New
        </button>
      </div>
    </div>
  `,

  headerFormLayout: `
    <form class="add add-header row">
      <div class="col-auto">
        <input 
          type="text"
          placeholder="Header-Name"
          name="header-key"
          class="form-control"
        />
      </div>
      <div class="col-auto">
        <input 
          type="text"
          placeholder="Header-Value"
          name="header-value"
          class="form-control"
        />
      </div>
      <div class="col-auto">
        <button 
          type="submit" 
          name="header-toggle" 
          class="btn btn-outline-secondary"
        >
        Add
        </button>
      </div>
      <div class="col-auto remove-btn header-remove__btn">
        <button
          type="button"
          name="header-remove"
          class="header-remove btn btn-outline-danger"
        >
        Remove
        </button>
      </div>
    </form>
  `,

  bodyOverviewLayout: `
    <div class="overview">
      <b>Usage:</b>
      <ul>
        <li>
          First of all, Choose the type of body you want to send
          along with your request.
        </li>
        <li>
          If you choose json, the <code>Content-Type</code> header will be
          added directly to the request headers <br> specifying 
          <code>application/json</code>. Other than that you can 
          edit the type on the request headers.
        </li>
        <li>Don't forget to save your changes. Last picked choice (json or other)
         will be saved <br> and any other boilerplate will be discarded.
        </li>
      </ul>
      <div class="proceed-container">
        <button id="body-proceed" class="btn btn-secondary">Okay</button>
      </div>
    </div>
  `,

  bodyLayout: `
    <div class="req-body">
      <div class="req-body__action">
        <div id="body-type__switch" class="body-types">
          <span id="json__body-type" class="body-type body-type__active">JSON</span>
          <span id="other__body-type" class="body-type">Other</span>
        </div>
        <div class="body-save">
          <button id="save-body__btn" class="btn btn-primary">Save</button>
        </div>
      </div>
      <div id="body-editor" class="editor">
        <textarea
          class="req-body__editor form-control"
          rows="11"
          id="req-body__content"
          placeholder="Put your request body here..."
        ></textarea>
      </div>
    </div>
  `,

  popupLayout: `
    <div class="popup" id="popup-main"></div>
  `,

  popupSuccessLayout: `
    <style>
      .popup {
        border-top: 3px solid #66de93;
      }
    </style>
    <div class="popup-status popup-status__success">
      <span>Success</span>
      <i id="popup-close" class="bi bi-check-circle-fill popup-icon"></i>
    </div>
    <div class="popup-body"></div>
  `,

  popupFailLayout: `
    <style>
      .popup {
        border-top: 3px solid #d83a56;
      }
    </style>
    <div class="popup-status popup-status__fail">
      <span>Fail</span>
      <i id="popup-close" class="bi bi-x-circle-fill popup-icon"></i>
    </div>
    <div class="popup-body"></div>
  `,
};
