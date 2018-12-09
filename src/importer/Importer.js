import { NODE_TYPES } from "./types/index";
import { sortFramesByPosition } from "./utils/sort-frame";
import axios from "axios";

const serializeNode = (node, imageRefs) => {
  let Node = NODE_TYPES[node.type];
  return new Node(node, imageRefs);
};

const parseNode = (node, imageRefs) => {
  let serializedNode = serializeNode(node, imageRefs);

  if (node.children) {
    let groupMask;
    for (let nodeChild of node.children) {
      let subSerializedNode = parseNode(nodeChild, imageRefs);
      if (groupMask) {
        subSerializedNode.groupMask = groupMask;
      }
      if (subSerializedNode.isMask) {
        groupMask = subSerializedNode;
      }
      subSerializedNode.parentNode = serializedNode;
      serializedNode.children.push(subSerializedNode);
    }
  }

  return serializedNode;
};

const setTree = (node, tree) => {};

export default class Importer {
  static loadPage(project, pageIndex = 0, imageRefs) {
    const page = project.document.children[pageIndex];
    let parsedPage = parseNode(page, imageRefs);
    parsedPage.children = sortFramesByPosition(parsedPage.children);

    return parsedPage;
  }

  static async get(key) {
    const project = (await axios.get(
      `https://api.figma.com/v1/files/${key}?geometry=paths`,
      {
        headers: {
          "X-FIGMA-TOKEN": "5739-2890786e-42d8-4ad8-96b1-5ef1f2378a93"
        }
      }
    )).data;

    const images = (await axios.get(
      `https://api.figma.com/v1/files/${key}/images`,
      {
        headers: {
          "X-FIGMA-TOKEN": "5739-2890786e-42d8-4ad8-96b1-5ef1f2378a93"
        }
      }
    )).data;

    return { project, images };
  }
}
