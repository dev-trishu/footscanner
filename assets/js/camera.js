class Camera {
  constructor(video, canvas) {
    this.video = video;
    this.canvas = canvas;
  }

  async start() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true
      });
      this.video.srcObject = stream;
    } catch (err) {
      alert("Camera access denied");
      console.error(err);
    }
  }
}