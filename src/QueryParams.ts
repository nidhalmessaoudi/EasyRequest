import layout from "./layout";
import Main from "./Main";
import Modal from "./Modal";

export default class QueryParams {
  private static title = "Query Params";

  public static main() {
    Modal.main();
    Main.render("beforeend", layout.paramsLayout, Modal.modal);
    const modalTitle = document.getElementById("modal-title")!;
    modalTitle.textContent = QueryParams.title;
  }
}
