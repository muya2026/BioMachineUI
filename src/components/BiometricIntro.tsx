import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

interface BiometricIntroProps {
  onComplete: () => void;
}

/**
 * Biometric Calibration Intro Screen
 * Displays a cyberpunk-style calibration modal with optional eye-tracking setup
 */
export const BiometricIntro: React.FC<BiometricIntroProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [cameraPermission, setCameraPermission] = useState<'pending' | 'granted' | 'denied'>('pending');
  const [eyeTrackingEnabled, setEyeTrackingEnabled] = useState(false);
  const [showScanner, setShowScanner] = useState(true);

  // Simulate calibration progress
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  /**
   * Request camera permission for eye-tracking
   */
  const requestCameraAccess = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraPermission('granted');
      
      // Initialize WebGazer.js
      const webgazer = (window as any).webgazer;
      if (webgazer) {
        webgazer.setRegression('ridge')
          .setGazeListener((data: any) => {
            if (data) {
              console.log('[WebGazer] Eye position:', data.x, data.y);
            }
          })
          .begin();
        
        setEyeTrackingEnabled(true);
        soundEngine.playSuccess();
      }
    } catch (err) {
      console.warn('[BiometricIntro] Camera access denied:', err);
      setCameraPermission('denied');
      soundEngine.playError();
    }
  };

  /**
   * Skip calibration and proceed to main app
   */
  const handleSkip = () => {
    setShowScanner(false);
    setTimeout(() => {
      onComplete();
    }, 500);
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-bio-darker/95 backdrop-blur-sm transition-opacity duration-500 ${showScanner ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(var(--bio-violet) 1px, transparent 1px),
              linear-gradient(90deg, var(--bio-violet) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            animation: 'pulse-slow 3s infinite'
          }}
        />
      </div>

      {/* Main calibration card */}
      <div className="relative w-full max-w-lg mx-4 p-8 border border-bio-green/30 rounded-2xl bg-bio-dark/80 shadow-2xl shadow-bio-green/20">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-bio-green neon-text">
            CALIBRATING NEURAL INTERFACE...
          </h1>
          <button
            onClick={handleSkip}
            className="p-2 hover:bg-bio-violet/20 rounded-lg transition-colors"
            onMouseEnter={() => soundEngine.playHover()}
          >
            <X className="w-6 h-6 text-bio-cyan" />
          </button>
        </div>

        {/* Progress ring SVG */}
        <div className="flex justify-center mb-8">
          <div className="relative w-48 h-48">
            {/* Outer ring */}
            <svg className="w-full h-full rotate-[-90deg]" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#1a1a2e"
                strokeWidth="8"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                className="transition-all duration-100 ease-linear"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00FF88" />
                  <stop offset="100%" stopColor="#8B00FF" />
                </linearGradient>
              </defs>
            </svg>

            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-white">{progress}%</span>
              <span className="text-xs text-bio-cyan mt-1">NEURAL SYNC</span>
            </div>
          </div>
        </div>

        {/* Scanner frame overlay */}
        {progress >= 100 && (
          <div className="mb-6 p-4 border border-bio-violet/30 rounded-lg bg-bio-darker/50">
            <div className="flex items-center gap-3 mb-3">
              {eyeTrackingEnabled ? (
                <Eye className="w-5 h-5 text-bio-green" />
              ) : (
                <EyeOff className="w-5 h-5 text-bio-violet" />
              )}
              <span className="text-sm text-gray-300">
                {eyeTrackingEnabled ? 'Eye-tracking active' : 'Eye-tracking disabled'}
              </span>
            </div>

            <button
              onClick={requestCameraAccess}
              disabled={cameraPermission === 'granted' || cameraPermission === 'denied'}
              className={`w-full py-2 px-4 rounded font-semibold transition-all ${
                cameraPermission === 'denied' || eyeTrackingEnabled
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-bio-green to-bio-cyan text-bio-darker hover:shadow-lg hover:shadow-bio-green/50'
              }`}
              onMouseEnter={() => soundEngine.playHover()}
            >
              {cameraPermission === 'denied' 
                ? 'Camera Access Denied' 
                : eyeTrackingEnabled 
                  ? 'Eye-tracking Enabled ✓' 
                  : 'Enable Eye-Tracking'}
            </button>
          </div>
        )}

        {/* Proceed button */}
        {progress >= 100 && (
          <button
            onClick={handleSkip}
            className="w-full py-3 px-6 bg-gradient-to-r from-bio-violet to-bio-cyan text-white font-bold rounded-lg hover:shadow-lg hover:shadow-bio-violet/50 transition-all animate-glow"
            onMouseEnter={() => soundEngine.playHover()}
          >
            PROCEED TO MATRIX
          </button>
        )}

        {/* Status messages */}
        <div className="mt-4 text-center">
          {progress < 30 && (
            <p className="text-sm text-bio-green animate-pulse">Initializing neural pathways...</p>
          )}
          {progress >= 30 && progress < 70 && (
            <p className="text-sm text-bio-cyan animate-pulse">Synchronizing bio-rhythms...</p>
          )}
          {progress >= 70 && progress < 100 && (
            <p className="text-sm text-bio-violet animate-pulse">Calibrating visual cortex...</p>
          )}
        </div>
      </div>
    </div>
  );
};
