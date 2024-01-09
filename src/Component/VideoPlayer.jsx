import React, { useRef, useState, useEffect } from 'react';
import * as faceapi from 'face-api.js';

const VideoPlayer = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isPlaying, setPlaying] = useState(false);

  useEffect(() => {
    const initializeCanvas = async () => {
      const canvas = canvasRef.current;
      resizeCanvas(canvas);
      // Load the Tiny Face Detector model from public/model
      await faceapi.nets.tinyFaceDetector.loadFromUri('./model');
    };

    initializeCanvas();
  }, []);

  const resizeCanvas = (canvas) => {
    const parent = canvas.parentElement;
    const { width, height } = parent.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;
  };

  const stopVideo = () => {
    const video = videoRef.current;
    video.pause();
    setPlaying(false);
  };

  const startVideo = () => {
    const video = videoRef.current;
    video.play();
    setPlaying(true);
    detectFaces();
  };

  const detectFaces = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).run();

    // Clear previous drawings
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

    // Draw rectangles around detected faces
    detections.forEach((detection) => {
      const { x, y, width, height } = detection.relativeBox;
      const ctx = canvas.getContext('2d');
      ctx.beginPath();
      ctx.rect(x * canvas.width, y * canvas.height, width * canvas.width, height * canvas.height);
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'red';
      ctx.stroke();
    });

    requestAnimationFrame(() => detectFaces()); // Continue detecting faces in the next animation frame
  };

  const handleFileChange = () => {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (file) {
      const video = videoRef.current;
      video.src = URL.createObjectURL(file);

      video.onloadedmetadata = () => {
        startVideo();
      };
    }
  };

  return (
    <div className='flex-col h-screen  p-5'>
      <div className='flex place-content-center min-w-full bg-white p-2'>
        <input className=' bg-white rounded-lg  hover:bg-gray-100 hover:text-blue-700' id='fileInput' type='file' accept='video/*' onChange={handleFileChange} />
        {isPlaying ? <button class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900  hover:bg-gray-100 hover:text-blue-700 " onClick={stopVideo}>Stop</button> : <button class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900  hover:bg-gray-100 hover:text-blue-700 " onClick={startVideo}>Start</button>}
      </div>
      <div className='bg-white mt-10' style={{ position: 'relative', width: '100%', height: '100%' }}>
        <video
          ref={videoRef}
          onClick={() => setPlaying(!isPlaying)}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <canvas
          ref={canvasRef}
          style={{ position: 'absolute', zIndex: 3, border: '1px solid #ddd', top: 0, left: 0, width: '100%', height: '100%' }}
        />
      </div>

    </div>
  );
};

export default VideoPlayer;
