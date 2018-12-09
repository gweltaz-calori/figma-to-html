import FrameBase from "./FrameBase";
const isRoot = node =>
  node.relativeTransform[0][2] === node.absoluteBoundingBox.x &&
  node.type === "FRAME" &&
  node.relativeTransform[1][2] === node.absoluteBoundingBox.y;
export default class Frame extends FrameBase {
  constructor(opts) {
    super(
      opts.id,
      opts.name,
      "FRAME",
      opts.visible,
      opts.backgroundColor,
      opts.opacity,
      opts.size,
      opts.absoluteBoundingBox,
      opts.relativeTransform,
      opts.isMask,
      opts.effects
    );

    this.clipsContent = opts.clipsContent;
  }

  draw(refs) {
    let el = super.draw(refs);
    el.style.position = "relative";
    el.style.top = isRoot(this)
      ? 0
      : `${this.absoluteBoundingBox.y -
          this.parentNode.absoluteBoundingBox.y}px`;
    el.style.left = isRoot(this)
      ? 0
      : `${this.absoluteBoundingBox.x -
          this.parentNode.absoluteBoundingBox.x}px`;

    if (this.clipsContent) {
      el.style.overflow = "hidden";
    }

    return el;
  }
}
