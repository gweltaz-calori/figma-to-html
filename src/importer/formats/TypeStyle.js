export default class TypeStyle {
  constructor(opts = {}) {
    this.fontFamily = opts.fontFamily;
    this.fontPostScriptName = opts.fontPostScriptName;
    this.fontWeight = opts.fontWeight;
    this.fontSize = opts.fontSize;
    this.letterSpacing = opts.letterSpacing;
    this.lineHeightPx = opts.lineHeightPx;
    this.lineHeightPercent = opts.lineHeightPercent;
    this.textAlignHorizontal = opts.textAlignHorizontal || "LEFT";
    "RIGHT" || "CENTER" || "JUSTIFIED";
    this.textAlignVertical = opts.textAlignVertical || "TOP";
    "CENTER" || "BOTTOM";
  }

  getHorizontalAlignement() {
    switch (this.textAlignHorizontal) {
      default:
        return "left";
      case "RIGHT":
        return "right";
      case "CENTER":
        return "center";
      case "JUSTIFIED":
        return "justify";
    }
  }
}
