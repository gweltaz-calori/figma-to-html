export default class VectorPath {
  constructor(opts) {
    this.path = opts.path;
    this.windingRule = opts.windingRule || "EVENODD" || "NONZERO";
  }
}
