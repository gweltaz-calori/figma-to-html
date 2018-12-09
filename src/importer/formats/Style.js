export default class Style {
  constructor(name, styleType) {
    this.name = name;
    this.styleType = styleType || "FILL";
    "STROKE" || "TEXT" || "EFFECT" || "GRID";
  }
}
