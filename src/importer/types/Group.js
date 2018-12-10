import FrameBase from "./FrameBase";

export default class Group extends FrameBase {
  constructor(opts) {
    super(opts);
    this.type = "GROUP";
  }

  draw(refs) {
    let el = super.draw(refs);

    el.style.top = `${this.absoluteBoundingBox.y -
      this.parentNode.absoluteBoundingBox.y}px`;
    el.style.left = `${this.absoluteBoundingBox.x -
      this.parentNode.absoluteBoundingBox.x}px`;

    return el;
  }
}
