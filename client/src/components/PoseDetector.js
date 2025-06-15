import React, { useState, useRef, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import * as poseDetection from '@tensorflow-models/pose-detection';
import axios from 'axios';

// Define connections between keypoints
const POSE_CONNECTIONS = [
  ['left_shoulder', 'right_shoulder'],
  ['left_shoulder', 'left_elbow'],
  ['left_elbow', 'left_wrist'],
  ['right_shoulder', 'right_elbow'],
  ['right_elbow', 'right_wrist'],
  ['left_shoulder', 'left_hip'],
  ['right_shoulder', 'right_hip'],
  ['left_hip', 'right_hip'],
  ['left_hip', 'left_knee'],
  ['left_knee', 'left_ankle'],
  ['right_hip', 'right_knee'],
  ['right_knee', 'right_ankle'],
];

function PoseDetector() {
  const [feedback, setFeedback] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [poseData, setPoseData] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [exerciseName, setExerciseName] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const detectorRef = useRef(null);
  const [videoDimensions, setVideoDimensions] = useState({ width: 640, height: 480 });

  useEffect(() => {
    async function loadDetector() {
      try {
        setFeedback('Loading MoveNet model...');
        await tf.ready();
        const detector = await poseDetection.createDetector(
          poseDetection.SupportedModels.MoveNet,
          {
            modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
          }
        );
        detectorRef.current = detector;
        setFeedback('Model loaded. Upload video to begin.');
      } catch (err) {
        console.error('Model load error:', err);
        setFeedback('Failed to load model.');
      }
    }
    loadDetector();

    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
        URL.revokeObjectURL(videoRef.current.src);
      }
    };
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith('video/')) {
      setFeedback('Please upload a valid video file.');
      return;
    }
    setVideoFile(file);
    const video = videoRef.current;
    video.src = URL.createObjectURL(file);
    
    // Set video dimensions when metadata is loaded
    video.onloadedmetadata = () => {
      setVideoDimensions({
        width: video.videoWidth,
        height: video.videoHeight
      });
    };
    
    setFeedback('Video loaded. Click "Analyze" to start.');
  };

  const drawKeypoint = (ctx, x, y, score) => {
    if (score > 0.3) {
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fillStyle = '#00FF00';
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  };

  const drawSkeleton = (ctx, keypoints) => {
    POSE_CONNECTIONS.forEach(([i, j]) => {
      const kp1 = keypoints.find(kp => kp.name === i);
      const kp2 = keypoints.find(kp => kp.name === j);

      if (kp1 && kp2 && kp1.score > 0.3 && kp2.score > 0.3) {
        ctx.beginPath();
        ctx.moveTo(kp1.x, kp1.y);
        ctx.lineTo(kp2.x, kp2.y);
        ctx.strokeStyle = '#00FF00';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });
  };

  const drawPose = (pose) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const video = videoRef.current;
    if (!video) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw video frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Draw keypoints
    pose.keypoints.forEach((kp) => {
      drawKeypoint(ctx, kp.x, kp.y, kp.score);
    });

    // Draw skeleton
    drawSkeleton(ctx, pose.keypoints);
  };

  const saveSession = async (accuracy, feedback) => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      if (!token || !userId) {
        setFeedback('Please log in to save your session.');
        return;
      }

      const response = await axios.post(
        'http://localhost:5000/session',
        {
          exercise: exerciseName,
          accuracy: accuracy,
          feedback: feedback,
          userId: userId
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.status === 201) {
        setFeedback('Session saved successfully!');
      }
    } catch (error) {
      console.error('Error saving session:', error);
      setFeedback('Failed to save session. Please try again.');
    }
  };

  const analyzeVideo = async () => {
    if (!detectorRef.current || !videoFile) {
      setFeedback('Missing video or model.');
      return;
    }

    if (!exerciseName) {
      setFeedback('Please enter the exercise name.');
      return;
    }

    const video = videoRef.current;
    const detector = detectorRef.current;

    // Set canvas dimensions to match video
    const canvas = canvasRef.current;
    canvas.width = videoDimensions.width;
    canvas.height = videoDimensions.height;

    video.play();
    setIsAnalyzing(true);
    setFeedback('Analyzing...');

    let totalAccuracy = 0;
    let frameCount = 0;

    const detect = async () => {
      if (video.paused || video.ended) {
        setIsAnalyzing(false);
        const averageAccuracy = totalAccuracy / frameCount;
        const feedback = `Completed ${exerciseName} with ${averageAccuracy.toFixed(1)}% accuracy`;
        await saveSession(averageAccuracy, feedback);
        return;
      }

      try {
        const poses = await detector.estimatePoses(video);
        if (poses.length > 0) {
          drawPose(poses[0]);
          setPoseData(poses[0]);

          // Calculate accuracy based on keypoint confidence
          const keypoints = poses[0].keypoints;
          const validKeypoints = keypoints.filter(kp => kp.score > 0.3);
          const frameAccuracy = (validKeypoints.length / keypoints.length) * 100;
          totalAccuracy += frameAccuracy;
          frameCount++;
        }
      } catch (error) {
        console.error('Error during pose detection:', error);
      }

      requestAnimationFrame(detect);
    };

    detect();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Pose Detector (MoveNet)</h2>

        <div className="mb-4">
          <label className="block mb-2 font-semibold">Exercise Name</label>
          <input
            type="text"
            value={exerciseName}
            onChange={(e) => setExerciseName(e.target.value)}
            placeholder="Enter exercise name (e.g., Squats, Push-ups)"
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />

          <label className="block mb-2 font-semibold">Upload Video</label>
          <input
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <video
              ref={videoRef}
              className="w-full rounded shadow"
              controls
              style={{ display: videoFile ? 'block' : 'none' }}
            />
          </div>
          <div>
            <canvas
              ref={canvasRef}
              className="w-full rounded shadow"
              style={{ display: videoFile ? 'block' : 'none' }}
            />
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={analyzeVideo}
            disabled={!videoFile || isAnalyzing || !exerciseName}
            className={`px-6 py-2 rounded text-white font-semibold ${
              !videoFile || isAnalyzing || !exerciseName
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>

        {feedback && (
          <div className="mt-4 p-3 rounded bg-blue-100 text-blue-700">
            {feedback}
          </div>
        )}

        {poseData && (
          <div className="mt-4 p-4 bg-gray-50 rounded">
            <h3 className="font-semibold mb-2">Pose Data</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {poseData.keypoints.map((kp, i) => (
                <div key={i}>
                  <strong>{kp.name || kp.part}:</strong> {(kp.score * 100).toFixed(1)}%
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PoseDetector;
