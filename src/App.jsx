import React from 'react';
import DashboardLayout from './layouts/DashboardLayout';
import SensorCard from './components/SensorCard';
import { Thermometer, Droplets, Sun, Activity, Zap } from 'lucide-react';
import useFirebaseData from './hooks/useFirebaseData';

export default function App() {
  const sensorData = useFirebaseData('sensors');
  const postureColor = sensorData.posture === 'Bad' ? 'rose' : 'emerald';

  return (
    <DashboardLayout>
      {/* Header Section */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Workspace Command Center</h2>
          <p className="text-sm text-slate-400 mt-1">Real-time posture monitoring and environmental control system (SDG 3 & 4).</p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-lg shadow-indigo-500/5">
            <Zap className="w-3.5 h-3.5 mr-1.5 animate-bounce" /> Live Sync Active
          </span>
        </div>
      </div>

      {/* Sensor Cards Grid Only */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SensorCard title="Room Temp" value={sensorData.temperature} unit="°C" icon={Thermometer} status="DHT11 Sensor" color="amber" />
        <SensorCard title="Humidity" value={sensorData.humidity} unit="%" icon={Droplets} status="DHT11 Sensor" color="blue" />
        <SensorCard title="Desk Light" value={sensorData.ldr} unit="Lux" icon={Sun} status="LDR Sensor" color="yellow" />
        <SensorCard title="Posture Status" value={sensorData.posture} unit="" icon={Activity} status="Ultrasonic" color={postureColor} />
      </div>
    </DashboardLayout>
  );
}