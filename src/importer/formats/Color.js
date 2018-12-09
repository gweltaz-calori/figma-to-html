import SuperMath from "../utils/SuperMath";
export default class Color {
  constructor(opts) {
    this.r = SuperMath.clamp(opts.r, 0, 1);
    this.g = SuperMath.clamp(opts.g, 0, 1);
    this.b = SuperMath.clamp(opts.b, 0, 1);
    this.a = SuperMath.clamp(opts.a, 0, 1);
  }

  format() {
    return `rgba(${this.r * 255},${this.g * 255},${this.b * 255},${this.a})`;
  }

  formatToMatrix() {
    return `0 0 0 0 ${this.r} 0 0 0 0 ${this.g} 0 0 0 0 ${this.b} 0 0 0 ${
      this.a
    } 0`;
  }
}
