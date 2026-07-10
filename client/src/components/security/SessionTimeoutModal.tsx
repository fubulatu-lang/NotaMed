import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

interface SessionTimeoutModalProps {
  timeoutMinutes?: number;
}

export default function SessionTimeoutModal({ timeoutMinutes = 10 }: SessionTimeoutModalProps) {
  const { logout } = useAuth();
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(60); // 1 minute warning

  useEffect(() => {
    let warningTimer: number;
    let countdownTimer: number;

    const resetTimers = () => {
      clearTimeout(warningTimer);
      clearInterval(countdownTimer);
      setShowWarning(false);
      setCountdown(60);

      // Show warning 1 minute before timeout
      warningTimer = window.setTimeout(() => {
        setShowWarning(true);
        
        countdownTimer = window.setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(countdownTimer);
              logout();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }, (timeoutMinutes - 1) * 60 * 1000);
    };

    // Reset on user activity
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach((event) => window.addEventListener(event, resetTimers));

    resetTimers();

    return () => {
      clearTimeout(warningTimer);
      clearInterval(countdownTimer);
      events.forEach((event) => window.removeEventListener(event, resetTimers));
    };
  }, [timeoutMinutes, logout]);

  if (!showWarning) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-3xl shadow-elevation-4 p-8 max-w-sm w-full animate-slide-up">
        <div className="text-center">
          <div className="text-5xl mb-4">⏰</div>
          <h2 className="text-title-lg mb-2">Session Expiring</h2>
          <p className="text-body-md text-on-surface-variant mb-4">
            Your session will end in {countdown} seconds due to inactivity.
          </p>
          <p className="text-label-sm text-on-surface-variant mb-6">
            This helps protect patient data privacy.
          </p>
          <button
            onClick={() => {
              setShowWarning(false);
              setCountdown(60);
            }}
            className="btn-primary w-full"
          >
            I'm Still Here
          </button>
        </div>
      </div>
    </div>
  );
}
