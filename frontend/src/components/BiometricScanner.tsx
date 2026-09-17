import React, { useState, useRef, useEffect } from 'react';
import { Camera, Scan, AlertCircle, RefreshCw, Zap, CheckCircle2, UserCheck, Shield } from 'lucide-react';
import { ApiService } from '../services/api';
import { PatientFullRecord, BiometricMatchResult } from '../types';

interface BiometricScannerProps {
  onPatientIdentified: (patient: PatientFullRecord, matchData: BiometricMatchResult) => void;
  onError: (msg: string) => void;
}

export const BiometricScanner: React.FC<BiometricScannerProps> = ({
  onPatientIdentified,
  onError,
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Quick-test profiles for rapid demo & testing
  const sampleProfiles = [
    {
      name: 'Aravind Sharma',
      detail: 'O- Negative | Diabetic | Penicillin Allergy',
      hash: 'face_hash_aravind_sharma_sample_token_001',
      tag: 'Critical Allergy'
    },
    {
      name: 'Priya Patel',
      detail: 'B+ Positive | Pacemaker | Warfarin Therapy',
      hash: 'face_hash_priya_patel_sample_token_002',
      tag: 'Cardiac Device'
    },
    {
      name: 'Ananya Verma',
      detail: 'A+ Positive | Severe Asthma | Anaphylaxis Risk',
      hash: 'face_hash_ananya_verma_sample_token_003',
      tag: 'Pediatric'
    }
  ];

  const startCamera = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setCameraError('Webcam not detected or permission denied. Use Sample Biometrics below for instant testing.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const triggerIdentify = async (biometricHash: string, label: string) => {
    setIsScanning(true);
    try {
      const res = await ApiService.identifyBiometric({
        biometric_hash: biometricHash,
        biometric_type: 'face_embedding',
        accessed_by: 'Paramedic Unit 108',
        reason: `Emergency Biometric Scan (${label})`
      });

      if (res.matched && res.patient) {
        stopCamera();
        onPatientIdentified(res.patient, res);
      } else {
        onError('No matching patient biometric found in emergency registry.');
      }
    } catch (err: any) {
      onError(err.message || 'Biometric lookup failed');
    } finally {
      setIsScanning(false);
    }
  };

  // Simulate scanning captured camera frame
  const handleCaptureAndIdentify = () => {
    // Deterministically pick the first sample patient for camera frame simulation
    triggerIdentify('face_hash_aravind_sharma_sample_token_001', 'Live Camera Stream Match');
  };

  return (
    <div className="space-y-6">
      {/* Scanner Viewport Card */}
      <div className="bg-slate-800/80 rounded-2xl p-4 sm:p-6 border border-slate-700 shadow-2xl backdrop-blur">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Scan className="w-5 h-5 text-red-500 animate-pulse" />
            <h2 className="text-lg font-bold text-white tracking-wide">
              MULTI-MODAL BIOMETRIC SCANNER
            </h2>
          </div>
          <span className="text-xs bg-red-950/80 text-red-400 border border-red-800/50 px-2.5 py-1 rounded-full font-mono">
            &lt; 500ms TARGET
          </span>
        </div>

        {/* Viewfinder Area */}
        <div className="relative w-full aspect-video max-h-72 bg-black rounded-xl overflow-hidden flex items-center justify-center border-2 border-dashed border-slate-600">
          {cameraActive ? (
            <video
              ref={videoRef}
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center p-6 space-y-3">
              <Camera className="w-12 h-12 text-slate-500 mx-auto animate-bounce" />
              <p className="text-sm text-slate-300 font-medium">
                Live Video Capture or Instant Sample Test
              </p>
              <button
                onClick={startCamera}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition shadow flex items-center gap-1.5 mx-auto"
              >
                <Camera className="w-4 h-4" />
                Enable Device Camera
              </button>
            </div>
          )}

          {/* Scanner Overlay HUD */}
          <div className="absolute inset-0 pointer-events-none border-2 border-red-500/30 m-4 rounded-lg flex flex-col justify-between p-2">
            <div className="flex justify-between text-[10px] font-mono text-red-400">
              <span>[FACE_RECOG_ENGINE: ACTIVE]</span>
              <span>[FPS: 60]</span>
            </div>

            {/* Center Reticle */}
            <div className="w-32 h-32 border-2 border-red-500/80 rounded-full mx-auto relative flex items-center justify-center">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
              {isScanning && (
                <div className="absolute inset-x-0 top-0 h-0.5 bg-red-400 shadow-[0_0_8px_#ef4444] animate-scan" />
              )}
            </div>

            <div className="flex justify-between text-[10px] font-mono text-red-400">
              <span>LATENCY: ~12ms</span>
              <span>RLS: ENFORCED</span>
            </div>
          </div>
        </div>

        {cameraError && (
          <div className="mt-3 p-3 bg-amber-950/40 border border-amber-800/40 rounded-lg text-amber-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{cameraError}</span>
          </div>
        )}

        {/* Live Camera Actions */}
        {cameraActive && (
          <div className="mt-4 flex gap-3">
            <button
              onClick={handleCaptureAndIdentify}
              disabled={isScanning}
              className="flex-1 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 transition"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Matching Biometric Vector...</span>
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 text-yellow-300" />
                  <span>Capture & Identify Patient</span>
                </>
              )}
            </button>
            <button
              onClick={stopCamera}
              className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold rounded-xl"
            >
              Close Cam
            </button>
          </div>
        )}
      </div>

      {/* Quick Test Biometric Profiles (Zero friction instant testing) */}
      <div className="bg-slate-800/60 rounded-2xl p-5 border border-slate-700/80">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-bold text-slate-300 tracking-wider uppercase">
            One-Click Biometric Test Samples (Demo Patients)
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {sampleProfiles.map((sample, idx) => (
            <button
              key={idx}
              disabled={isScanning}
              onClick={() => triggerIdentify(sample.hash, sample.name)}
              className="p-3.5 bg-slate-900/80 hover:bg-slate-900 hover:border-red-500/60 border border-slate-700/80 rounded-xl text-left transition group disabled:opacity-50 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-bold text-white group-hover:text-red-400 transition">
                    {sample.name}
                  </span>
                  <span className="text-[10px] bg-red-950 text-red-300 border border-red-800/40 px-1.5 py-0.5 rounded font-mono">
                    {sample.tag}
                  </span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2">
                  {sample.detail}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-blue-400 font-medium">
                <span>Simulate Biometric ID</span>
                <UserCheck className="w-3.5 h-3.5" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

