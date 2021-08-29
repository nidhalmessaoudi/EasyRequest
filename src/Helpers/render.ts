import CONFIG from "../utils/CONFIG";

export default function render(
  position: InsertPosition,
  layout: string,
  parentEl?: HTMLElement
) {
  if (!parentEl) {
    CONFIG.root.insertAdjacentHTML(position, layout);
    return;
  }
  parentEl.insertAdjacentHTML(position, layout);
}
