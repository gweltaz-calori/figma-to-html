import Vector from "./Vector";
import TypeStyle from "../formats/TypeStyle";
import Paint from "../formats/Paint";

export default class Text extends Vector {
  constructor(opts) {
    super(opts);
    this.type = "TEXT";

    this.characters = opts.characters;
    this.style = new TypeStyle(opts.style);
    this.characterStyleOverrides = opts.characterStyleOverrides || [];
    this.styleOverrideTable = opts.styleOverrideTable || {};
  }

  draw(refs) {
    let el = document.createElement("div");
    el.style.position = "absolute";
    el.style.top = `${this.absoluteBoundingBox.y -
      this.parentNode.absoluteBoundingBox.y}px`;
    el.style.left = `${this.absoluteBoundingBox.x -
      this.parentNode.absoluteBoundingBox.x}px`;
    el.style.opacity = this.opacity;
    el.style.width = `${this.absoluteBoundingBox.width + 2}px`;
    el.style.height = `${this.absoluteBoundingBox.height}px`;
    el.style.fontSize = `${this.style.fontSize}px`;
    el.style.fontFamily = this.style.fontFamily;
    el.style.fontWeight = this.style.fontWeight;
    el.style.userSelect = "none";
    el.style.display = "flex";

    if (this.style.textAlignHorizontal === "CENTER") {
      el.style.justifyContent = "center";
    } else if (this.style.textAlignHorizontal === "RIGHT") {
      el.style.justifyContent = "flex-end";
    }
    if (this.style.textAlignVertical === "CENTER") {
      el.style.alignItems = "center";
    } else if (this.style.textAlignHorizontal === "RIGHT") {
      el.style.alignItems = "flex-end";
    }

    for (let fill of this.fills) {
      el.style.color = fill.apply();
    }

    for (let letterIndex in this.characters) {
      let letterEl = document.createElement("span");
      if (this.characters[letterIndex] == " ") {
        letterEl.innerHTML = "&nbsp;";
      } else {
        letterEl.textContent = this.characters[letterIndex];
      }

      letterEl.style.fontFamily = "inherit";

      let letterOverrideName = this.characterStyleOverrides[letterIndex];

      let letterOverrideProperties = this.styleOverrideTable[
        letterOverrideName
      ];

      el.appendChild(letterEl);

      if (!letterOverrideProperties) continue;

      for (let fill of letterOverrideProperties.fills || []) {
        letterEl.style.color = new Paint(fill).apply();
      }

      if (letterOverrideProperties.fontSize) {
        el.style.fontSize = `${letterOverrideProperties.fontSize}px`;
      }

      if (letterOverrideProperties.fontFamily) {
        el.style.fontFamily = letterOverrideProperties.fontFamily;
      }

      if (letterOverrideProperties.fontWeight) {
        el.style.fontWeight = letterOverrideProperties.fontWeight;
      }
    }

    el.setAttribute("type", this.type);

    if (this.name.includes("#")) {
      refs[this.name.replace("#", "")] = el;
    }

    return el;
  }
}
