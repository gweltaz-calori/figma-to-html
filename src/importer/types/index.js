import Rectangle from "./Rectangle";
import Canvas from "./Canvas";
import Text from "./Text";
import FrameBase from "./FrameBase";
import Vector from "./Vector";
import Frame from "./Frame";
import Group from "./Group";
import Document from "./Document";

export const NODE_TYPES = {
  CANVAS: Canvas,
  TEXT: Text,
  LINE: Vector,
  DOCUMENT: Document,
  GROUP: Group,
  ELLIPSE: Vector,
  VECTOR: Vector,
  INSTANCE: FrameBase,
  COMPONENT: FrameBase,
  FRAME: Frame,
  RECTANGLE: Rectangle
};
