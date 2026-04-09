class ImageProcessor {
  constructor(canvasId) {
    this.canvasId = canvasId;
  }

  measureFoot() {

    if (!window.cvReady) {
      alert("OpenCV not ready");
      return;
    }

    let src = cv.imread(this.canvasId);
    let gray = new cv.Mat();
    let edges = new cv.Mat();
    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();

    // STEP 1: preprocess
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
    cv.GaussianBlur(gray, gray, new cv.Size(5, 5), 0);
    cv.Canny(gray, edges, 50, 150);

    // STEP 2: find contours
    cv.findContours(edges, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

    let paperContour = null;
    let maxArea = 0;

    // STEP 3: detect A4 paper
    for (let i = 0; i < contours.size(); i++) {
      let cnt = contours.get(i);
      let area = cv.contourArea(cnt);

      let peri = cv.arcLength(cnt, true);
      let approx = new cv.Mat();
      cv.approxPolyDP(cnt, approx, 0.02 * peri, true);

      if (approx.rows === 4 && area > maxArea) {
        paperContour = approx;
        maxArea = area;
      }
    }

    if (!paperContour) {
      alert("Paper not detected");
      return;
    }

    // STEP 4: perspective transform
    let pts = [];
    for (let i = 0; i < 4; i++) {
      pts.push({
        x: paperContour.intPtr(i, 0)[0],
        y: paperContour.intPtr(i, 0)[1]
      });
    }

    pts.sort((a, b) => a.y - b.y);
    let top = pts.slice(0, 2).sort((a, b) => a.x - b.x);
    let bottom = pts.slice(2, 4).sort((a, b) => a.x - b.x);

    let ordered = [top[0], top[1], bottom[1], bottom[0]];

    let srcTri = cv.matFromArray(4, 1, cv.CV_32FC2, [
      ordered[0].x, ordered[0].y,
      ordered[1].x, ordered[1].y,
      ordered[2].x, ordered[2].y,
      ordered[3].x, ordered[3].y
    ]);

    let width = 595;
    let height = 842;

    let dstTri = cv.matFromArray(4, 1, cv.CV_32FC2, [
      0, 0,
      width, 0,
      width, height,
      0, height
    ]);

    let M = cv.getPerspectiveTransform(srcTri, dstTri);
    let warped = new cv.Mat();

    cv.warpPerspective(src, warped, M, new cv.Size(width, height));

    // STEP 5: detect foot (🔥 FIXED)
    let gray2 = new cv.Mat();
    let thresh = new cv.Mat();
    let contours2 = new cv.MatVector();

    cv.cvtColor(warped, gray2, cv.COLOR_RGBA2GRAY);
    cv.threshold(gray2, thresh, 0, 255, cv.THRESH_BINARY_INV + cv.THRESH_OTSU);

    cv.findContours(thresh, contours2, new cv.Mat(), cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

    let footContour = null;
    let maxArea2 = 0;

    for (let i = 0; i < contours2.size(); i++) {
      let cnt = contours2.get(i);
      let area = cv.contourArea(cnt);

      // ❗ Ignore paper (too big)
      if (area > 300000) continue;

      // ❗ Ignore noise (too small)
      if (area < 5000) continue;

      if (area > maxArea2) {
        maxArea2 = area;
        footContour = cnt;
      }
    }

    if (!footContour) {
      alert("Foot not detected properly");
      return;
    }

    // STEP 6: measure
    let rect = cv.minAreaRect(footContour);
    let footPixelLength = Math.max(rect.size.width, rect.size.height);

    let pixelsPerCm = 842 / 29.7;
    let cm = footPixelLength / pixelsPerCm;

    alert("Foot: " + cm.toFixed(2) + " cm\nSize: " + this.getSize(cm));

    // cleanup
    src.delete(); gray.delete(); edges.delete();
    contours.delete(); hierarchy.delete();
    warped.delete(); gray2.delete(); thresh.delete(); contours2.delete();
  }

  getSize(cm) {
    if (cm < 22) return 4;
    else if (cm < 23) return 5;
    else if (cm < 24) return 6;
    else if (cm < 25) return 7;
    else if (cm < 26) return 8;
    else if (cm < 27) return 9;
    else if (cm < 28) return 10;
    else return 11;
  }
}