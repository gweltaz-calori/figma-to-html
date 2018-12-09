import Color from "./Color";
import SuperMath from "../utils/SuperMath";

export default class ColorStop {
  constructor(opts) {
    this.position = SuperMath.clamp(opts.position, 0, 1);
    this.color = new Color(opts.color);
  }
}
