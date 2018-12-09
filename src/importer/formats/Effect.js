import Vector2D from "./Vector2D";
import Color from "./Color";

export default class Effect {
  constructor(opts = {}) {
    this.type =
      opts.type ||
      "INNER_SHADOW" ||
      "DROP_SHADOW" ||
      "LAYER_BLUR" ||
      "BACKGROUND_BLUR";

    this.visible = opts.visible;
    this.radius = opts.radius;
    if (opts.color) {
      this.color = new Color(opts.color);
    }
    this.offset = new Vector2D(opts.offset);
  }

  static sortByOrder(effects) {
    let newEffects = [];

    let dropShadow = effects.find(effect => effect.type === "DROP_SHADOW");
    let innerShadow = effects.find(effect => effect.type === "INNER_SHADOW");
    let layerBlur = effects.find(effect => effect.type === "LAYER_BLUR");
    [dropShadow, innerShadow, layerBlur].map(effect => {
      if (effect) {
        newEffects.push(effect);
      }
    });

    return newEffects;
  }

  format(nodeType) {
    switch (nodeType) {
      case "VECTOR":
        return this.formatToSvg();
      default:
        return this.formatToCss();
    }
  }

  formatToCss() {
    switch (this.type) {
      case "DROP_SHADOW":
        return `${this.offset.x}px ${this.offset.y}px ${
          this.radius
        }px ${this.color.format()}`;
        break;
      case "INNER_SHADOW":
        return `inset ${this.offset.x}px ${this.offset.y}px ${
          this.radius
        }px ${this.color.format()}`;
        break;
      case "LAYER_BLUR":
        return `blur(${this.radius}px)`;
        break;
    }
  }

  _createSVGLayerBlur(filter, input) {
    const output = "effect_layer_blur";
    let feGaussianBlur = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "feGaussianBlur"
    );

    let feBlendBackground = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "feBlend"
    );

    feGaussianBlur.setAttributeNS(null, "stdDeviation", this.radius / 2);
    feGaussianBlur.setAttributeNS(null, "result", output);

    feBlendBackground.setAttributeNS(null, "in2", input);
    feBlendBackground.setAttributeNS(null, "in", "SourceGraphic");
    feBlendBackground.setAttributeNS(null, "mode", "normal");
    feBlendBackground.setAttributeNS(null, "result", "shape");

    if (input === "BackgroundImageFix") {
      filter.appendChild(feBlendBackground);
    }
    filter.appendChild(feGaussianBlur);

    return output;
  }

  _createSVGInnerShadow(filter, input) {
    const output = "effect_inner_shadow";

    let feBlendBackground = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "feBlend"
    );

    let feMainColorMatrix = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "feColorMatrix"
    );
    let feOffset = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "feOffset"
    );
    let feGaussianBlur = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "feGaussianBlur"
    );

    let feColorMatrixAlpha = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "feColorMatrix"
    );

    let feComposite = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "feComposite"
    );

    let feBlendShadow = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "feBlend"
    );

    feMainColorMatrix.setAttributeNS(null, "in", "SourceAlpha");
    feMainColorMatrix.setAttributeNS(null, "type", "matrix");
    feMainColorMatrix.setAttributeNS(
      null,
      "values",
      `0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 255 0`
    );
    feMainColorMatrix.setAttributeNS(null, "result", "hardAlpha");

    feOffset.setAttributeNS(null, "dx", this.offset.x);
    feOffset.setAttributeNS(null, "dy", this.offset.y);

    feComposite.setAttributeNS(null, "in2", "hardAlpha");
    feComposite.setAttributeNS(null, "operator", "arithmetic");
    feComposite.setAttributeNS(null, "k2", -1);
    feComposite.setAttributeNS(null, "k3", 1);

    feGaussianBlur.setAttributeNS(null, "stdDeviation", this.radius / 2);

    feColorMatrixAlpha.setAttributeNS(
      null,
      "values",
      this.color.formatToMatrix()
    );
    feColorMatrixAlpha.setAttributeNS(null, "type", "matrix");

    feBlendShadow.setAttributeNS(null, "in2", "shape");
    feBlendShadow.setAttributeNS(null, "mode", "normal");
    feBlendShadow.setAttributeNS(null, "result", output);

    feBlendBackground.setAttributeNS(null, "in2", input);
    feBlendBackground.setAttributeNS(null, "in", "SourceGraphic");
    feBlendBackground.setAttributeNS(null, "mode", "normal");
    feBlendBackground.setAttributeNS(null, "result", "shape");

    filter.appendChild(feBlendBackground);
    filter.appendChild(feMainColorMatrix);
    filter.appendChild(feOffset);
    filter.appendChild(feGaussianBlur);
    filter.appendChild(feComposite);
    filter.appendChild(feColorMatrixAlpha);
    filter.appendChild(feBlendShadow);

    return output;
  }

  _createSVGDropShadow(filter) {
    const output = "effect_drop_shadow";

    let feMainColorMatrix = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "feColorMatrix"
    );
    let feOffset = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "feOffset"
    );
    let feGaussianBlur = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "feGaussianBlur"
    );

    let feColorMatrixAlpha = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "feColorMatrix"
    );

    let feBlendSource = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "feBlend"
    );

    let feBlendShadow = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "feBlend"
    );

    feMainColorMatrix.setAttributeNS(null, "in", "SourceAlpha");
    feMainColorMatrix.setAttributeNS(null, "type", "matrix");
    feMainColorMatrix.setAttributeNS(
      null,
      "values",
      `0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 255 0`
    );

    feOffset.setAttributeNS(null, "dx", this.offset.x);
    feOffset.setAttributeNS(null, "dy", this.offset.y);

    feGaussianBlur.setAttributeNS(null, "stdDeviation", this.radius / 2);

    feColorMatrixAlpha.setAttributeNS(
      null,
      "values",
      this.color.formatToMatrix()
    );
    feColorMatrixAlpha.setAttributeNS(null, "type", "matrix");

    feBlendShadow.setAttributeNS(null, "in2", "BackgroundImageFix");
    feBlendShadow.setAttributeNS(null, "mode", "normal");
    feBlendShadow.setAttributeNS(null, "result", output);

    feBlendSource.setAttributeNS(null, "in", "SourceGraphic");
    feBlendSource.setAttributeNS(null, "in2", output);
    feBlendSource.setAttributeNS(null, "mode", "normal");
    feBlendSource.setAttributeNS(null, "result", "shape");

    filter.appendChild(feMainColorMatrix);
    filter.appendChild(feOffset);
    filter.appendChild(feGaussianBlur);
    filter.appendChild(feColorMatrixAlpha);
    filter.appendChild(feBlendShadow);
    filter.appendChild(feBlendSource);

    return output;
  }

  toSVG(filter, input) {
    switch (this.type) {
      case "DROP_SHADOW":
        return this._createSVGDropShadow(filter, input);
      case "INNER_SHADOW":
        return this._createSVGInnerShadow(filter, input);
      case "LAYER_BLUR":
        return this._createSVGLayerBlur(filter, input);
    }
  }
}
