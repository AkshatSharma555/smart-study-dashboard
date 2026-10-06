import React, { useEffect } from 'react';
import DashboardLayout from './layouts/DashboardLayout';
import SensorCard from './components/SensorCard';
import PostureCamera from './components/PostureCamera';
import { Thermometer, Droplets, Sun, Eye, Activity, Zap, Sparkles } from 'lucide-react';
import useFirebaseData from './hooks/useFirebaseData';
import toast, { Toaster } from 'react-hot-toast';

export default function App() {
  const { data: sensorData, lastUpdated } = useFirebaseData('sensors');
  
  // --------------------------------------------------------
  // DYNAMIC INTELLIGENCE RULES (Status & Color Logic)
  // --------------------------------------------------------
  
  // 1. Distance Logic
  const distanceValue = sensorData.distance !== undefined ? sensorData.distance : '--';
  const isTooClose = distanceValue !== '--' && Number(distanceValue) < 40;
  const distanceDetails = {
    status: distanceValue === '--' ? 'Waiting...' : (isTooClose ? 'Eye Strain Risk!' : 'Safe Distance'),
    color: isTooClose ? 'rose' : 'emerald'
  };

  // 2. Posture Logic
  const postureValue = sensorData.posture || 'Good';
  const postureDetails = {
    status: postureValue === 'Bad' ? 'Slouching Detected' : 'Optimal Alignment',
    color: postureValue === 'Bad' ? 'rose' : 'emerald'
  };

  // 3. Temperature Logic (Ideal: 20°C - 28°C)
  const getTempDetails = (val) => {
    if (val === '--') return { status: 'Waiting...', color: 'slate' };
    const t = Number(val);
    if (t < 20) return { status: 'Too Cold', color: 'blue' };
    if (t > 28) return { status: 'Too Hot', color: 'rose' };
    return { status: 'Optimal Temp', color: 'emerald' };
  };
  const tempDetails = getTempDetails(sensorData.temperature);

  // 4. Humidity Logic (Ideal: 30% - 70%)
  const getHumDetails = (val) => {
    if (val === '--') return { status: 'Waiting...', color: 'slate' };
    const h = Number(val);
    if (h < 30) return { status: 'Dry Air', color: 'amber' };
    if (h > 70) return { status: 'Too Humid', color: 'blue' };
    return { status: 'Comfortable', color: 'emerald' };
  };
  const humDetails = getHumDetails(sensorData.humidity);

  // 5. Light Logic (Ideal: 200 - 800 Lux)
  const getLightDetails = (val) => {
    if (val === '--') return { status: 'Waiting...', color: 'slate' };
    const l = Number(val);
    if (l < 200) return { status: 'Too Dark', color: 'rose' };
    if (l > 800) return { status: 'Too Bright', color: 'amber' };
    return { status: 'Good Lighting', color: 'emerald' };
  };
  const lightDetails = getLightDetails(sensorData.ldr);


  // --------------------------------------------------------
  // SMART ALERTS (Toast Notifications)
  // --------------------------------------------------------
  useEffect(() => {
    if (postureValue === 'Bad') {
      toast.error('Spine Alert: Slouching Detected! Please sit straight.', {
        id: 'posture-alert', duration: 4000,
        style: { borderRadius: '12px', background: '#1e293b', color: '#fff', border: '1px solid #e11d48' },
      });
    }
    if (isTooClose) {
      toast.error(`Eye Strain Warning: You are too close to the screen (${distanceValue}cm)!`, {
        id: 'eye-alert', icon: '👀', duration: 4000,
        style: { borderRadius: '12px', background: '#1e293b', color: '#fff', border: '1px solid #f43f5e' },
      });
    }
    if (sensorData.temperature !== '--' && Number(sensorData.temperature) > 30) {
      toast.error(`High Temp Warning: ${sensorData.temperature}°C`, {
        id: 'temp-alert', icon: '🔥', duration: 4000,
        style: { borderRadius: '12px', background: '#1e293b', color: '#fff', border: '1px solid #f59e0b' },
      });
    }
  }, [postureValue, sensorData.temperature, distanceValue, isTooClose]);

  // Decision Intelligence Score Calculation
  const calculateComfort = () => {
    if (sensorData.temperature === '--' || sensorData.humidity === '--' || sensorData.ldr === '--') {
      return { score: '--', status: 'Waiting for sensor metrics...' };
    }
    let score = 100;
    const t = Number(sensorData.temperature);
    const h = Number(sensorData.humidity);
    const l = Number(sensorData.ldr);

    if (t < 20 || t > 28) score -= Math.abs(t - 24) * 4;
    if (h < 30 || h > 70) score -= Math.abs(h - 50) * 0.4;
    if (l < 200 || l > 800) score -= 15;

    score = Math.max(30, Math.min(100, Math.round(score)));
    let status = 'Optimal for Deep Work ✨';
    if (score < 60) status = 'Sub-optimal Environment ⚠️';
    else if (score < 80) status = 'Fair Study Conditions 🌤️';
    return { score, status };
  };
  const comfort = calculateComfort();


  // --------------------------------------------------------
  // UI RENDER
  // --------------------------------------------------------
  return (
    <DashboardLayout>
      <Toaster position="top-right" reverseOrder={false} />

      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Workspace Command Center</h2>
          <p className="text-sm text-slate-400 mt-1">Real-time IoT & AI Health Monitoring System (SDG 3 & 4).</p>
        </div>
        
        <div className="flex flex-col items-end">
          <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-lg shadow-indigo-500/5 mb-1.5">
            <Zap className="w-3.5 h-3.5 mr-1.5 animate-bounce" /> Live Sync Active
          </span>
          <span className="text-xs text-slate-500 font-medium tracking-wide">
            {lastUpdated ? `Last updated: ${lastUpdated.toLocaleTimeString()}` : 'Waiting for sync...'}
          </span>
        </div>
      </div>

      {/* Comfort Index Banner */}
      <div className="mb-8 p-5 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-slate-900/60 to-purple-950/40 border border-indigo-500/20 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-center space-x-4">
          <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-indigo-300 uppercase">AI Environment Index</h3>
            <p className="text-xl font-bold text-white mt-0.5">{comfort.status}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3 bg-slate-900/80 px-6 py-3 rounded-xl border border-slate-800 shadow-inner">
          <span className="text-sm text-slate-400 font-medium">Efficiency Score:</span>
          <span className="text-2xl font-extrabold text-emerald-400">{comfort.score}%</span>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Left Column (5/12 width): Camera + Posture Status Card */}
        <div className="xl:col-span-5 flex flex-col gap-6 h-full">
          <PostureCamera />
          <SensorCard 
            title="Spine Posture" 
            value={postureValue} 
            unit="" 
            icon={Activity} 
            status={postureDetails.status} 
            color={postureDetails.color} 
          />
        </div>

        {/* Right Column (7/12 width): Perfect 2x2 Grid for Hardware Sensors */}
        <div className="xl:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 h-fit">
          <SensorCard 
            title="Room Temp" 
            value={sensorData.temperature} 
            unit="°C" 
            icon={Thermometer} 
            status={tempDetails.status} 
            color={tempDetails.color} 
          />
          <SensorCard 
            title="Humidity" 
            value={sensorData.humidity} 
            unit="%" 
            icon={Droplets} 
            status={humDetails.status} 
            color={humDetails.color} 
          />
          <SensorCard 
            title="Desk Light" 
            value={sensorData.ldr} 
            unit="Lux" 
            icon={Sun} 
            status={lightDetails.status} 
            color={lightDetails.color} 
          />
          <SensorCard 
            title="Screen Distance" 
            value={distanceValue} 
            unit="cm" 
            icon={Eye} 
            status={distanceDetails.status} 
            color={distanceDetails.color} 
          />
        </div>

      </div>
    </DashboardLayout>
  );
}