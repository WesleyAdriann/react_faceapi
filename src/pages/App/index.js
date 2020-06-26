import React, { useEffect , useRef, useState } from 'react';
import Webcam from 'react-webcam';
import * as FaceApi from 'face-api.js';

import { ENDPOINTS } from '../../settings';

import './style.css';

const App = () => {
  const [modelsIsLoading, setModelsIsLoading] = useState(true);

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  let videoInterval = 0;

  useEffect(() => {
    Promise.all([
      // FaceApi.nets.faceLandmark68Net.loadFromUri(ENDPOINTS.modelsFaceDetector.landMark),
      // FaceApi.nets.faceLandmark68TinyNet.loadFromUri(ENDPOINTS.modelsFaceDetector.tinyLandMark),
      // FaceApi.nets.faceRecognitionNet.loadFromUri(ENDPOINTS.modelsFaceDetector.faceRecognition),
      FaceApi.nets.tinyFaceDetector.loadFromUri(ENDPOINTS.modelsFaceDetector.tinyFaceDetector),
    ]).then(() => setModelsIsLoading(false));
  })

  useEffect(() => () => webcamRef.current.video.removeEventListener('play'), []);

  const handleOnUserMedia = () => {
    const canvasCtx = canvasRef.current.getContext('2d');
    const { video } = webcamRef.current;
    video.addEventListener('play', () => {
      const displaySize = { width: video.width, height: video.height };
      FaceApi.matchDimensions(canvasRef.current, displaySize);
      videoInterval = setInterval(async () => {
        const detections = await FaceApi.detectAllFaces(video, new FaceApi.TinyFaceDetectorOptions());
        const resizedDetections = FaceApi.resizeResults(detections, displaySize);

        canvasCtx.clearRect(0 ,0, canvasRef.current.width, canvasRef.current.height);
        FaceApi.draw.drawDetections(canvasRef.current, resizedDetections);
      });
    })
  }

  return (
    <div>
      <div>React - Face Api</div>
      {
        !modelsIsLoading && (
          <div className='webcam-wrapper'>
            <canvas
              className='canvas'
              height='500'
              ref={canvasRef}
              width='500'
            />
            <Webcam
              audio={false}
              height='500'
              onUserMedia={handleOnUserMedia}
              ref={webcamRef}
              screenshotFormat='image/jpeg'
              videoConstraints={{
                width: 500,
                height: 500,
                facingMode: 'user'
              }}
              width='500'
            />
          </div>
        )
      }
      <div onClick={() => alert(videoInterval)}>x</div>
    </div>
  )
}

export default App;
