import Vector2D from "../formats/Vector2D";
import Rect from "../formats/Rect";
import Effect from "../formats/Effect";
import Paint from "../formats/Paint";
import VectorPath from "../formats/VectorPath";
import Global from "./Global";
import SuperMath from "../utils/SuperMath";

export default class Vector extends Global {
  constructor(opts, imageRefs) {
    super(opts.id, opts.name, opts.type, opts.visible, opts.relativeTransform);
    this.opacity = opts.opacity || 1;
    this.absoluteBoundingBox = new Rect(opts.absoluteBoundingBox);
    this.size = new Vector2D(opts.size);
    this.effects = [];
    this.fills = [];
    this.fillGeometry = [];
    this.strokes = [];
    this.strokeWeight = opts.strokeWeight;
    this.strokeGeometry = [];
    this.strokeAlign = opts.strokeAlign || "INSIDE" || "OUTSIDE" || "CENTER";
    this.lineCapHeight = 4.5;
    this.isMask = opts.isMask || false;

    if (this.isMask) {
      this.maskName = `mask_${this.id}`;
    }

    for (let effect of opts.effects || []) {
      this.effects.push(new Effect(effect));
    }

    this.effects = Effect.sortByOrder(this.effects);

    for (let fill of opts.fills || []) {
      this.fills.push(new Paint(fill, imageRefs));
    }

    for (let stroke of opts.strokes || []) {
      this.strokes.push(new Paint(stroke, imageRefs));
    }

    for (let path of opts.fillGeometry || []) {
      this.fillGeometry.push(new VectorPath(path));
    }

    for (let path of opts.strokeGeometry || []) {
      this.strokeGeometry.push(new VectorPath(path));
    }
  }

  draw() {
    switch (this.type) {
      case "RECTANGLE":
        return this._drawHtml();
      default:
        return this._drawSvg();
    }
  }

  getSVGBounds() {
    let x = 0;
    let y = 0;
    let width = this.absoluteBoundingBox.width;
    let height = this.absoluteBoundingBox.height;

    if (this.strokes.length > 0) {
      if (this.fillGeometry.length === 0) {
        width += this.strokeWeight;
        height += this.strokeWeight;
      }
    }

    const hasDropShadow = this.effects.find(
      effect => effect.type === "DROP_SHADOW"
    );

    let maxEffectRadius =
      this.effects.reduce(
        (radius, effect) => (effect.radius > radius ? effect.radius : radius),
        0
      ) || 0;

    if (this.strokeAlign === "CENTER") {
      x += this.strokeWeight / 2;
      y += this.strokeWeight / 2;
    } else if (this.strokeAlign === "OUTSIDE") {
      x += this.strokeWeight;
      y += this.strokeWeight;
    }

    width += maxEffectRadius * 2;
    height += maxEffectRadius * 2;

    if (this.effects && this.effects.length > 0) {
      x = width / 2 - this.absoluteBoundingBox.width / 2;
      y = height / 2 - this.absoluteBoundingBox.height / 2;
    }

    if (hasDropShadow) {
      x -= hasDropShadow.offset.x;
      y -= hasDropShadow.offset.y;
    }

    return { x, y, width, height };
  }

  _drawSvg() {
    let { x, y, width, height } = this.getSVGBounds();
    let transform = this.getSVGTransform();

    let fillGeoIndex = 0;
    let strokeGeoIndex = 0; //index so the svg has different id's

    const filterId = `filter_${this.id}`;

    let el = document.createElement("div");
    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    let groupRoot = document.createElementNS("http://www.w3.org/2000/svg", "g"); //this will hold filter and special effects
    let defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    let filter = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "filter"
    );

    let feFlood = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "feFlood"
    );

    feFlood.setAttributeNS(null, "flood-opacity", 0);
    feFlood.setAttributeNS(null, "result", "BackgroundImageFix");

    filter.appendChild(feFlood);

    svg.setAttributeNS(null, "width", width);
    svg.setAttributeNS(null, "height", height);
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.setAttributeNS(null, "viewBox", `0 0 ${width} ${height}`);
    svg.setAttribute("type", this.type);

    el.style.pointerEvents = "none";
    el.style.width = `${width}px`;
    el.style.height = `${height}px`;
    svg.style.position = "absolute";
    el.style.position = "absolute";
    el.style.opacity = this.opacity;

    svg.style.top = `${this.absoluteBoundingBox.y -
      this.parentNode.absoluteBoundingBox.y -
      y}px`;
    svg.style.left = `${this.absoluteBoundingBox.x -
      this.parentNode.absoluteBoundingBox.x -
      x}px`;

    filter.setAttributeNS(null, "id", filterId);
    filter.setAttributeNS(null, "filterUnits", "userSpaceOnUse");
    filter.setAttributeNS(null, "color-interpolation-filters", "sRGB");

    path.setAttributeNS(
      null,
      "transform",
      `translate(${transform.translate.x + x} ${transform.translate.y +
        y}) rotate(${transform.rotation}) scale(${transform.scale.x} ${
        transform.scale.y
      })`
    );

    for (let strokeGeo of this.strokeGeometry) {
      path.setAttributeNS(null, "d", strokeGeo.path);
      for (let stroke of this.strokes) {
        let svgStroke = null;
        if (this.fillGeometry.length === 0) {
          svgStroke = stroke.toSVG("stroke", this.id, strokeGeoIndex);
          path.setAttributeNS(null, "fill", svgStroke.name);
          path.setAttributeNS(null, "fill-rule", strokeGeo.windingRule);
          path.setAttributeNS(null, "clip-rule", strokeGeo.windingRule);
        } else {
          svgStroke = stroke.toSVG("stroke", this.id, strokeGeoIndex);
          path.setAttributeNS(null, "stroke", svgStroke.name);
          path.setAttributeNS(null, "stroke-width", this.strokeWeight);
          //@todo stroke-linecap && stroke-linejoin
        }

        if (svgStroke.effect) {
          defs.appendChild(svgStroke.effect);
        }
      }

      strokeGeoIndex++;
    }

    for (let fillGeo of this.fillGeometry) {
      path.setAttributeNS(null, "d", fillGeo.path);
      for (let fill of this.fills) {
        let svgFill = fill.toSVG("fill", this.id, fillGeoIndex);
        path.setAttributeNS(null, "fill", svgFill.name);
        path.setAttributeNS(null, "fill-rule", fillGeo.windingRule);
        path.setAttributeNS(null, "clip-rule", fillGeo.windingRule);

        if (svgFill.effect) {
          defs.appendChild(svgFill.effect);
        }
      }

      fillGeoIndex++;
    }

    let input = "BackgroundImageFix";

    for (let effect in this.effects) {
      let effectItem = this.effects[effect];
      input = effectItem.toSVG(filter, input);
    }

    if (this.isMask) {
      let clipPath = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "clipPath"
      );
      clipPath.setAttributeNS(null, "id", this.maskName);
      clipPath.appendChild(path);

      defs.appendChild(clipPath);
    } else {
      if (this.effects && this.effects.length > 0) {
        groupRoot.setAttributeNS(null, "filter", `url(#${filterId})`);
        groupRoot.appendChild(path);
        defs.appendChild(filter);
        svg.appendChild(groupRoot);
      } else {
        svg.appendChild(path);
      }
    }

    if (defs.childElementCount > 0) {
      svg.appendChild(defs);
    }

    if (this.groupMask) {
      let maskBounds = this.groupMask.getSVGBounds();
      el.style.top = `${maskBounds.y}px`;
      el.style.left = `${maskBounds.x}px`;
      el.style.clipPath = `url(#${this.groupMask.maskName})`;
    }

    el.appendChild(svg);

    return el;
  }

  _drawHtml() {
    let transform = this.getSVGTransform();
    let elWrapper = document.createElement("div");
    let el = document.createElement("div");
    el.style.position = "absolute";
    elWrapper.style.position = "absolute";
    el.style.top = `${this.absoluteBoundingBox.y -
      this.parentNode.absoluteBoundingBox.y}px`;
    el.style.left = `${this.absoluteBoundingBox.x -
      this.parentNode.absoluteBoundingBox.x}px`;
    el.style.opacity = this.opacity;
    el.style.transformOrigin = "top left";
    el.style.transform = `translate(${transform.translate.x}px, ${
      transform.translate.y
    }px) rotate(${transform.rotation}deg) scale(${transform.scale.x},${
      transform.scale.y
    })`;

    el.setAttribute("type", this.type);

    el.style.width = `${this.size.x}px`;
    el.style.height = `${this.size.y}px`;
    elWrapper.style.width = `${this.absoluteBoundingBox.width}px`;
    elWrapper.style.height = `${this.absoluteBoundingBox.height}px`;
    elWrapper.style.pointerEvents = "none";

    for (let fill of this.fills) {
      let transform = fill.getTransform();

      el.style.background = fill.apply();

      el.style.backgroundSize = fill.getScaleModeToCSS();
    }

    for (let effect of this.effects) {
      if (effect.type.includes("SHADOW")) {
        el.style.boxShadow = effect.format();
      } else {
        el.style.filter = effect.format();
      }
    }

    for (let stroke of this.strokes) {
      el.style.border = `solid ${stroke.color.format()} ${this.strokeWeight}px`;
    }

    if (this.groupMask) {
      let maskBounds = this.groupMask.getSVGBounds();
      elWrapper.style.top = `${maskBounds.y}px`;
      elWrapper.style.left = `${maskBounds.x}px`;
      elWrapper.style.clipPath = `url(#${this.groupMask.maskName})`;
    }

    elWrapper.appendChild(el);

    if (this.name.includes("#")) {
      refs[this.name.replace("#", "")] = elWrapper;
    }

    return elWrapper;
  }
}
