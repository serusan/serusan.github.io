const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');
var kekw = 0;
var prevkekw = 0;
var centery = 0;
var comm = 0;
var cdtime = 0
function onResults(results) {
  comm = 0
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(
      results.image, 0, 0, canvasElement.width, canvasElement.height);
  drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS,
                 {color: '#00FF00', lineWidth: 4});
  drawLandmarks(canvasCtx, results.poseLandmarks,
                {color: '#FF0000', lineWidth: 2});
  
  const kekw = results.poseLandmarks[0]['y'];
  if (prevkekw != 0 && cdtime == 0) {
	if ((prevkekw - kekw) > 0.06){
			console.log("Spring");
			comm = 1;
			cdtime = 80	
		}
	else if ((prevkekw - kekw) < -0.06){	
			console.log("Buk");
			comm = -1;
			cdtime = 80
		};
		
	}
  if (comm == 1){
	jump()  
	  
  };
  prevkekw = kekw;
  cdtime--;
  if (cdtime < 0){
	  cdtime = 0
  };
  canvasCtx.restore();
};

const pose = new Pose({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
}});
pose.setOptions({
  upperBodyOnly: true,
  smoothLandmarks: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});
pose.onResults(onResults);
const camera = new Camera(videoElement, {
  onFrame: async () => {
    await pose.send({image: videoElement});
  },
  width: 1280,
  height: 720
});

camera.start();
