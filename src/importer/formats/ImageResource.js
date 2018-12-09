export default class ImageResource {
  constructor(hash, imageRefs) {
    this.HASH_REGEX = /(?:ImageResource)(?:\((.+)\))/;
    this.url = `url("${imageRefs.meta.images[hash]}")`;
  }
}
