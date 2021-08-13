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
            >
                Send
            </button>
            </div>
        </form>
    </div>
    <div id="options-bar" class="req-options-bar">
        <span class="req-option" data-name="params">Params</span>
        <span class="req-option" data-name="headers">Headers</span>
        <span class="req-option" data-name="body">Body</span>
    </div>
    <div class="result-container" id="json-results"></div>
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
    <svg 
      xmlns="http://www.w3.org/2000/svg"
      width="22" height="22" fill="currentColor" 
      class="bi bi-brightness-high" 
      viewBox="0 0 16 16"
    >
      <path 
        d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0
          1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5
          0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1
          .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5
          0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3
          8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3
          8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5
          0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193
          9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 
          1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193
          2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1
          .707-.707l1.414 1.414a.5.5 0 0 1
          0 .707zM4.464 4.465a.5.5 0 0 1-.707
          0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414
          1.414a.5.5 0 0 1 0 .708z"
        />
    </svg>
  `,
  darkIconLayout: `
    <svg
      xmlns="http://www.w3.org/2000/svg" 
      width="22" height="22"
      fill="currentColor" 
      class="bi bi-moon" 
      viewBox="0 0 16 16"
    >
      <path 
      d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0
        4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787
        0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349
        0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266
        2.114 1.312 5.124.06A.752.752 0 0 1 6 .278zM4.858
        1.311A7.269 7.269 0 0 0 1.025 7.71c0 4.02 3.279
        7.276 7.319 7.276a7.316 7.316 0 0 0
        5.205-2.162c-.337.042-.68.063-1.029.063-4.61
        0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286z"
      />
    </svg>
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
    <div id="overlay">
      <style>
        body {
          overflow: hidden;
        }
      </style>
    </div>
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
      <input type="text" placeholder="Key" name="param-key" class="form-control" />
    </div>
    <div class="col-auto">
      <input type="text" placeholder="Value" name="param-value" class="form-control" />
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
        <input type="text" placeholder="Header-Name" name="header-key" class="form-control" />
      </div>
      <div class="col-auto">
        <input type="text" placeholder="Header-Value" name="header-value" class="form-control" />
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
        <textarea class="req-body__editor form-control" rows="11" id="req-body__content" placeholder="Put your request body here..."></textarea>
      </div>
    </div>
  `,
};
