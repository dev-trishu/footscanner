class Camera {
  constructor(video, canvas) {
    this.video = video;
    this.canvas = canvas;
  }

  async start() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment" // 🔥 back camera
        }
      });

      this.video.srcObject = stream;
    } catch (err) {
      alert("Camera error: " + err.message);
      console.error(err);
    }
  }
}