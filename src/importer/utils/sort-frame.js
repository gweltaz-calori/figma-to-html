export const sortFramesByPosition = frames => {
  let rows = [];

  for (let frame of frames) {
    let row = rows.find(row => {
      let frameBounds = {
        top: frame.absoluteBoundingBox.y,
        bottom: frame.absoluteBoundingBox.y + frame.absoluteBoundingBox.height
      };

      let rowBounds = {
        top: row.absoluteBoundingBox.y,
        bottom: row.absoluteBoundingBox.y + row.absoluteBoundingBox.height
      };

      return (
        (frameBounds.top >= rowBounds.top &&
          frameBounds.top <= rowBounds.bottom) ||
        (frameBounds.bottom <= rowBounds.bottom &&
          frameBounds.bottom >= rowBounds.top)
      );
    });

    if (row) {
      row.children.push(frame);
    } else {
      rows.push({
        children: [frame],
        name: frame.name,
        absoluteBoundingBox: frame.absoluteBoundingBox
      });
    }
  }

  rows = rows.sort((a, b) => a.absoluteBoundingBox.y - b.absoluteBoundingBox.y);

  let sortedFrames = [];
  for (let row of rows) {
    let sortedRow = row.children.sort(
      (a, b) => a.absoluteBoundingBox.x - b.absoluteBoundingBox.x
    );
    sortedFrames = sortedFrames.concat(sortedRow);
  }

  return sortedFrames;
};
