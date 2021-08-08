import Modal from "./Modal";

export default class Body extends Modal {
  private static title = "Body";

  public static override main() {
    super.main();
    Body.modalTitle.textContent = Body.title;
  }
}
