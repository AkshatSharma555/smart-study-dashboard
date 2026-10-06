import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { Camera, CameraOff, BrainCircuit } from 'lucide-react';
import { ref, set } from 'firebase/database';
import { database } from '../firebase/firebase';

export default function PostureCamera() {
  const webcamRef = useRef(null);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [cameraActive, setCameraActive] = useState(false);
  const [postureState, setPostureState] = useState('Good');
  
  useEffect(() => {
    let detector;
    let requestAnimationFrameId;

    const runAIPoseDetection = async () => {
      // Direct CDN variables ka use kar rahe hain window object se
      await window.tf.ready();
      const model = window.poseDetection.SupportedModels.MoveNet;
      detector = await window.poseDetection.createDetector(model);
      setIsModelLoading(false);

      const detect = async () => {
        if (webcamRef.current && webcamRef.current.video.readyState === 4 && cameraActive) {
          const video = webcamRef.current.video;
          const poses = await detector.estimatePoses(video);
          
          if (poses.length > 0) {
            const keypoints = poses[0].keypoints;
            const nose = keypoints.find(k => k.name === 'nose');
            const leftShoulder = keypoints.find(k => k.name === 'left_shoulder');
            const rightShoulder = keypoints.find(k => k.name === 'right_shoulder');

            if (nose?.score > 0.3 && leftShoulder?.score > 0.3) {
              const shoulderAvgY = (leftShoulder.y + rightShoulder.y) / 2;
              const distance = shoulderAvgY - nose.y;
              
              const isBad = distance < 50; 
              const newState = isBad ? 'Bad' : 'Good';
              
              setPostureState(newState);
              
              const dbRef = ref(database, 'sensors/posture');
              set(dbRef, newState);
            }
          }
        }
        requestAnimationFrameId = requestAnimationFrame(detect);
      };
      
      if (cameraActive) {
        detect();
      }
    };

    if (cameraActive) {
      runAIPoseDetection();
    }

    return () => {
      if (requestAnimationFrameId) {
        cancelAnimationFrame(requestAnimationFrameId);
      }
    };
  }, [cameraActive]);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl p-4 flex flex-col items-center justify-center min-h-[300px]">
      <div className="w-full flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold tracking-wide text-slate-200 flex items-center gap-2">
          <BrainCircuit className="w-4 h-4 text-indigo-400" />
          AI Vision Engine
        </h3>
        
        <button 
          onClick={() => setCameraActive(!cameraActive)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${cameraActive ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'}`}
        >
          {cameraActive ? <CameraOff className="w-3.5 h-3.5" /> : <Camera className="w-3.5 h-3.5" />}
          {cameraActive ? 'Stop AI Tracking' : 'Start AI Tracking'}
        </button>
      </div>

      <div className="relative w-full max-w-md aspect-video bg-black/50 rounded-xl overflow-hidden border border-slate-700/50 flex items-center justify-center shadow-inner">
        {isModelLoading && cameraActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 z-10">
            <span className="text-sm text-indigo-400 animate-pulse font-medium">Loading AI Model...</span>
          </div>
        )}
        
        {!cameraActive ? (
          <div className="text-slate-500 text-sm font-medium">Camera tracking is paused</div>
        ) : (
          <>
            <Webcam
              ref={webcamRef}
              muted={true}
              className="w-full h-full object-cover mirror"
              style={{ transform: 'scaleX(-1)' }}
            />
            <div className={`absolute bottom-3 right-3 px-3 py-1 rounded-full text-xs font-bold shadow-lg backdrop-blur-md ${postureState === 'Good' ? 'bg-emerald-500/80 text-white' : 'bg-rose-500/80 text-white animate-pulse'}`}>
              {postureState === 'Good' ? 'Perfect Posture' : 'Slouching Detected!'}
            </div>
          </>
        )}
      </div>
    </div>
  );
}