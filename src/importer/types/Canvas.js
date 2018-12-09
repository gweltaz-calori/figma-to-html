import Rect from "../formats/Rect";

export default class Canvas {
  constructor() {
    this.type = "CANVAS";
    this.absoluteBoundingBox = new Rect({
      x: 0,
      y: 0
    });
    this.children = [];
    this.visible = true;
  }
}
