"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Timer, Play, Pause, Square, Coffee, Brain, Minimize2 } from "lucide-react";

type TimerType = "focus" | "break" | null;

export function PomodoroTimer() {
  const [isOpen, setIsOpen] = useState(false);
  const [timerType, setTimerType] = useState<TimerType>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            playNotificationSound();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const playNotificationSound = () => {
    const audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.2);
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.4);

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.6
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.6);
  };

  const startTimer = (type: TimerType) => {
    if (type === "focus") {
      setTimeLeft(25 * 60); // 25 minutes
    } else if (type === "break") {
      setTimeLeft(5 * 60); // 5 minutes
    }
    setTimerType(type);
    setIsRunning(true);
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const stopTimer = () => {
    setIsRunning(false);
    setTimeLeft(0);
    setTimerType(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const getTimerColor = () => {
    if (timerType === "focus") return "text-red-600";
    if (timerType === "break") return "text-green-600";
    return "text-gray-600";
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`p-2 ${timerType && isRunning ? getTimerColor() : ""}`}
        >
          <Timer className="w-4 h-4" />
          {timerType && timeLeft > 0 && (
            <span className="ml-1 text-xs font-mono">
              {formatTime(timeLeft)}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Timer className="w-5 h-5" />
            Pomodoro Timer
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!timerType ? (
            <div className="grid grid-cols-1 gap-3">
              <Button
                onClick={() => startTimer("focus")}
                className="h-16 flex items-center justify-center gap-3 bg-red-500 hover:bg-red-600"
              >
                <Brain className="w-6 h-6" />
                <div className="text-left">
                  <div className="font-semibold">Fokus</div>
                  <div className="text-sm opacity-90">25 menit</div>
                </div>
              </Button>

              <Button
                onClick={() => startTimer("break")}
                className="h-16 flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600"
              >
                <Coffee className="w-6 h-6" />
                <div className="text-left">
                  <div className="font-semibold">Istirahat</div>
                  <div className="text-sm opacity-90">5 menit</div>
                </div>
              </Button>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                {timerType === "focus" ? (
                  <Brain className="w-6 h-6 text-red-600" />
                ) : (
                  <Coffee className="w-6 h-6 text-green-600" />
                )}
                <h3 className="text-lg font-semibold">
                  {timerType === "focus" ? "Waktu Fokus" : "Waktu Istirahat"}
                </h3>
              </div>

              <div
                className={`text-6xl font-mono font-bold ${getTimerColor()}`}
              >
                {formatTime(timeLeft)}
              </div>

                            <div className="flex items-center justify-center gap-2">
                <Button
                  onClick={toggleTimer}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  {isRunning ? (
                    <>
                      <Pause className="w-4 h-4" />
                      Jeda
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      Mulai
                    </>
                  )}
                </Button>
                
                <Button
                  onClick={stopTimer}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Square className="w-4 h-4" />
                  Stop
                </Button>
                
                <Button
                  onClick={() => setIsOpen(false)}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Minimize2 className="w-4 h-4" />
                  Minimize
                </Button>
              </div>

              {timeLeft === 0 && (
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-green-800 font-medium">
                    🎉 Timer selesai! Kerja bagus!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
