export default {
  initialLayout: `
    <h5 id="switch-theme">Theme</h5>
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
    <div class="req-options-bar">
        <span class="req-option active-option">Params</span>
        <span class="req-option">Headers</span>
        <span class="req-option">Body</span>
    </div>
    <div class="req-options-table">

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
        background-color: #444444;
      }
    
      .jsoneditor-statusbar,
      .ace_gutter {
        background-color: #444444 !important;
        color: #ffffff !important;
      }
    </style>
    `,
};
