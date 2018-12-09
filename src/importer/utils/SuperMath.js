export default class SuperMath {
  static clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  static range(value, oldMin = -1, oldMax = 1, newMin = 0, newMax = 1) {
    return ((value - oldMin) * (newMax - newMin)) / (oldMax - oldMin) + newMin;
  }

  static toDegrees(radians) {
    return (radians * 180) / Math.PI;
  }

  static toRadians(degrees) {
    return (degrees * Math.PI) / 180;
  }

  static multiplyMatrix(m1, m2) {
    var result = [];
    for (var i = 0; i < m1.length; i++) {
      result[i] = [];
      for (var j = 0; j < m2[0].length; j++) {
        var sum = 0;
        for (var k = 0; k < m1[0].length; k++) {
          sum += m1[i][k] * m2[k][j];
        }
        result[i][j] = sum;
      }
    }
    return result;
  }

  static identity() {
    return [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
  }
}
