document.addEventListener("DOMContentLoaded", () => {

  const video = document.getElementById("video");
  const canvas = document.getElementById("canvas");
  const captureBtn = document.getElementById("captureBtn");
  const retakeBtn = document.getElementById("retakeBtn");
  const context = canvas.getContext("2d");

  const camera = new Camera(video, canvas);
  camera.start();

  // ✅ Create processor
  const processor = new ImageProcessor("canvas");

  captureBtn.addEventListener("click", function () {

    // Capture frame
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // UI switch
    video.style.display = "none";
    canvas.style.display = "block";
    captureBtn.style.display = "none";
    retakeBtn.style.display = "inline-block";

    // 🔥 Measure foot (correct call)
    processor.measureFoot();
  });

  retakeBtn.addEventListener("click", function () {
    video.style.display = "block";
    canvas.style.display = "none";
    captureBtn.style.display = "inline-block";
    retakeBtn.style.display = "none";
  });

});