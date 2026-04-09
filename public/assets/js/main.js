document.addEventListener("DOMContentLoaded", () => {

const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const captureBtn = document.getElementById("captureBtn");
const retakeBtn = document.getElementById("retakeBtn");
const context = canvas.getContext("2d");


  const camera = new Camera(video, canvas);

  camera.start();

captureBtn.addEventListener("click", function () {

  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  video.style.display = "none";
  canvas.style.display = "block";
  captureBtn.style.display = "none";
  retakeBtn.style.display = "inline-block";
 measureFoot();
});

    captureBtn.addEventListener("click", function () {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      video.style.display = "none";
      canvas.style.display = "block";
      captureBtn.style.display = "none";
      retakeBtn.style.display = "inline-block";
    });

    retakeBtn.addEventListener("click", function () {
      video.style.display = "block";
      canvas.style.display = "none";
      captureBtn.style.display = "inline-block";
      retakeBtn.style.display = "none";
    });

});
