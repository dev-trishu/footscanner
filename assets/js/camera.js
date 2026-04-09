class Camera {
  constructor(videoElement, canvasElement) {
    this.video = videoElement;
    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext("2d");
  }

  async start() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" } // back camera on mobile
        }
      });

      this.video.srcObject = stream;

    } catch (error) {
      alert("Camera access denied or not available.");
      console.error(error);
    }
  }

  capture() {
    // Match canvas size to video
    this.canvas.width = this.video.videoWidth;
    this.canvas.height = this.video.videoHeight;

    this.ctx.drawImage(
      this.video,
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );

    return this.canvas;
  }
}
