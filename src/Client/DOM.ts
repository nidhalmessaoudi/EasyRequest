import JSONEditor from "jsoneditor";

export default class DOM {
  public static self: DOM;
  public reqEndpoint!: HTMLInputElement;
  public reqForm!: HTMLFormElement;
  public reqType!: HTMLSelectElement;
  public reqOptionsBar!: HTMLDivElement;
  public sendReqBtn!: HTMLButtonElement;
  public resultsEditor!: JSONEditor;
  public switchTheme!: HTMLSpanElement;
  public themeIcon!: HTMLElement;
  public newTabBtn!: HTMLButtonElement;

  private constructor() {}

  public static main() {
    if (!this.self) {
      this.self = new DOM();
    }
    this.self.init();
    return this.self;
  }

  private init() {
    this.reqForm = document.getElementById("req-form")! as HTMLFormElement;
    this.reqType = document.getElementById("req-type")! as HTMLSelectElement;
    this.reqEndpoint = document.getElementById(
      "req-endpoint"
    )! as HTMLInputElement;
    this.sendReqBtn = document.getElementById("send-req")! as HTMLButtonElement;
    this.reqOptionsBar = document.getElementById(
      "options-bar"
    ) as HTMLDivElement;
    this.switchTheme = document.getElementById(
      "theme-switch"
    ) as HTMLSpanElement;
    this.themeIcon = document.getElementById("bi-theme") as HTMLElement;
    this.newTabBtn = document.getElementById("new-tab") as HTMLButtonElement;

    const resultContainer = document.getElementById("json-results")!;
    this.resultsEditor = new JSONEditor(resultContainer, {
      mode: "code",
    });
  }
}
