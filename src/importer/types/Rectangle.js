import Vector from "./Vector";
export default class Rectangle extends Vector {
  constructor(opts, imageRefs) {
    super(opts, imageRefs);
    this.type = "RECTANGLE";
    this.cornerRadius = opts.cornerRadius || 0;
    this.rectangleCornerRadii = opts.rectangleCornerRadii || [0, 0, 0, 0];
  }

  draw(refs) {
    let elWrapper = super.draw(refs);
    elWrapper.children[0].style.borderTopLeftRadius = `${
      this.rectangleCornerRadii[0]
    }px`;
    elWrapper.children[0].style.borderTopRightRadius = `${
      this.rectangleCornerRadii[1]
    }px`;
    elWrapper.children[0].style.borderBottomRightRadius = `${
      this.rectangleCornerRadii[2]
    }px`;
    elWrapper.children[0].style.borderBottomLeftRadius = `${
      this.rectangleCornerRadii[3]
    }px`;
    return elWrapper;
  }
}
