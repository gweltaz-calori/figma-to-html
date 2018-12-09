import FrameBase from "./FrameBase";

export default class Group extends FrameBase {
  constructor(opts) {
    super(
      opts.id,
      opts.name,
      "GROUP",
      opts.visible,
      opts.backgroundColor,
      opts.opacity,
      opts.size,
      opts.absoluteBoundingBox,
      opts.relativeTransform,
      opts.isMask,
      opts.effects
    );
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
