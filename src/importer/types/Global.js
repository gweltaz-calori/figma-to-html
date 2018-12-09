import SuperMath from "../utils/SuperMath";
import Fluid from "../external/Fluid";
const isRoot = node =>
  node.relativeTransform[0][2] === node.absoluteBoundingBox.x &&
  node.type === "FRAME" &&
  node.relativeTransform[1][2] === node.absoluteBoundingBox.y;

export default class Global {
  constructor(id, name, type, visible, relativeTransform) {
    this.id = id;
    this.name = name;
    this.visible = visible || true;
    this.type = type;
    this.fluid = new Fluid();
    this.relativeTransform = relativeTransform || [[1, 0, 0], [0, 1, 0]];
    this.relativeTransform.push([0, 0, 1]); //add the transform for 3 axis (z)
  }

  getAbsoluteTranslation() {
    let x = isRoot(this) ? 0 : this.relativeTransform[0][2];
    let y = isRoot(this) ? 0 : this.relativeTransform[1][2];

    let parentTranslation = {
      x: 0,
      y: 0
    };

    if (this.parentNode && this.parentNode.getAbsoluteTranslation) {
      parentTranslation = this.parentNode.getAbsoluteTranslation();
    }

    return {
      x: parentTranslation.x + x,
      y: parentTranslation.y + y
    };
  }

  getSVGTransform() {
    let relativeTransform = SuperMath.multiplyMatrix(
      this.parentNode.getRelativeTransform(),
      this.relativeTransform
    );

    let a = relativeTransform[0][0];
    let b = relativeTransform[1][0];
    let c = relativeTransform[0][1];
    let d = relativeTransform[1][1];
    let e = parseFloat(relativeTransform[0][2].toFixed(3));
    let f = parseFloat(relativeTransform[1][2].toFixed(3));

    let rotation = 0;
    let scale = { x: 1, y: 1 };
    let skew = { x: 0, y: 0 };
    let translate = {
      x: e - this.absoluteBoundingBox.x,
      y: f - this.absoluteBoundingBox.y
    };

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
}
