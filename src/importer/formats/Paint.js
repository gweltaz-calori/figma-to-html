import Color from "./Color";
import Vector2D from "./Vector2D";
import ColorStop from "./ColorStop";
import ImageResource from "./ImageResource";
import SuperMath from "../utils/SuperMath";

export default class Paint {
  constructor(opts = {}, imageRefs) {
    this.type =
      opts.type ||
      "SOLID" ||
      "GRADIENT_LINEAR" ||
      "GRADIENT_RADIAL" ||
      "GRADIENT_ANGULAR" ||
      "GRADIENT_DIAMOND" ||
      "IMAGE" ||
      "EMOJI";

    this.visible = opts.visible || true;
    this.opacity = opts.opacity || 1;
    if (opts.color) {
      opts.color.a = this.opacity;
      this.color = new Color(opts.color);
    }
    this.gradientHandlePositions = [];
    this.gradientStops = [];
    this.imageTransform = opts.imageTransform;
    this.scaleMode = opts.scaleMode || "FILL";
    "FIT" || "TILE" || "STRETCH";
    if (opts.imageRef) {
      this.imageResource = new ImageResource(opts.imageRef, imageRefs);
    }

    for (let gradientHandle of opts.gradientHandlePositions || []) {
      this.gradientHandlePositions.push(new Vector2D(gradientHandle));
    }

    for (let gradientStop of opts.gradientStops || []) {
      this.gradientStops.push(new ColorStop(gradientStop));
    }
  }

  getScaleModeToCSS() {
    switch (this.scaleMode) {
      case "FILL":
        return "cover";
    }
  }

  getTransform() {
    if (!this.imageTransform) {
      return {
        rotation: 0,
        translate: { x: 0, y: 0 },
        skew: 0,
        scale: { x: 1, y: 1 }
      };
    }

    let a = this.imageTransform[0][0];
    let b = this.imageTransform[1][0];
    let c = this.imageTransform[0][1];
    let d = this.imageTransform[1][1];
    let e = parseFloat(this.imageTransform[0][2].toFixed(3));
    let f = parseFloat(this.imageTransform[1][2].toFixed(3));

    let rotation = 0;
    let scale = { x: 1, y: 1 };
    let skew = { x: 0, y: 0 };
    let translate = { x: e, y: f };

    let delta = a * d - b * c;

    if (a || b) {
      let r = Math.sqrt(a * a + b * b);
      rotation = b > 0 ? Math.acos(a / r) : -Math.acos(a / r);
      scale = {
        x: SuperMath.clamp(r, -1, 1),
        y: SuperMath.clamp(delta / r, -1, 1)
      };
    } else if (c || d) {
      let s = Math.sqrt(c * c + d * d);
      rotation =
        Math.PI * 0.5 - (d > 0 ? Math.acos(-c / s) : -Math.acos(c / s));
      scale = {
        x: SuperMath.clamp(delta / s, -1, 1),
        y: SuperMath.clamp(s, -1, 1)
      };
    } else {
      scale = { x: 0, y: 0 };
    }
    rotation = SuperMath.toDegrees(rotation);

    rotation = parseFloat(rotation.toFixed(3));
    return { rotation, translate, skew, scale };
  }

  apply() {
    switch (this.type) {
      case "GRADIENT_LINEAR":
        return this._paintToLinearGradient();
      case "GRADIENT_RADIAL":
        return this._paintToRadialGradient();
      case "IMAGE":
        return this._paintToImage();
      default:
        return this.color.format();
    }
  }

  toSVG(type, id, index) {
    switch (this.type) {
      case "GRADIENT_LINEAR":
        return this._paintToLinearGradientSVG(type, id, index);
      case "GRADIENT_RADIAL":
        return this._paintToRadialGradientSVG(type, id, index);
      default:
        return this._paintToFillColorSVG();
    }
  }

  _paintToLinearGradientSVG(type, id, index) {
    const gradientId = `paint_${type}_${id}_${index}_linear`;
    let linearGradient = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "linearGradient"
    );

    linearGradient.setAttributeNS(null, "id", gradientId);

    const handles = this.gradientHandlePositions;
    const handle0 = handles[0];
    const handle1 = handles[1];

    const ydiff = handle1.y - handle0.y;
    const xdiff = handle0.x - handle1.x;

    const angle = Math.atan2(-xdiff, -ydiff);

    linearGradient.setAttributeNS(null, "x1", handle0.x);
    linearGradient.setAttributeNS(null, "y1", handle0.y);

    linearGradient.setAttributeNS(null, "x2", handle1.x);
    linearGradient.setAttributeNS(null, "y2", handle1.y);

    this.gradientStops.map((stopItem, index) => {
      let stopEl = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "stop"
      );
      stopEl.setAttributeNS(null, "offset", stopItem.position);

      stopEl.setAttributeNS(null, "stop-color", stopItem.color.format());

      linearGradient.appendChild(stopEl);
    });

    return {
      effect: linearGradient,
      name: `url(#${gradientId})`
    };
  }

  _paintToFillColorSVG() {
    return {
      name: this.color.format()
    };
  }

  //@todo
  _paintToRadialGradientSVG() {}

  _paintToLinearGradient() {
    const handles = this.gradientHandlePositions;
    const handle0 = handles[0];
    const handle1 = handles[1];

    const ydiff = handle1.y - handle0.y;
    const xdiff = handle0.x - handle1.x;

    const angle = Math.atan2(-xdiff, -ydiff);
    const stops = this.gradientStops
      .map(stop => {
        return `${stop.color.format()} ${Math.round(stop.position * 100)}%`;
      })
      .join(", ");
    return `linear-gradient(${angle}rad, ${stops})`;
  }
  _paintToRadialGradient() {
    const stops = this.gradientStops
      .map(stop => {
        return `${stop.color.format()} ${Math.round(stop.position * 60)}%`;
      })
      .join(", ");

    return `radial-gradient(${stops})`;
  }

  _paintToImage() {
    return this.imageResource.url;
  }
}
