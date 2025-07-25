"use client";

import {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  MessageCircle,
  Send,
  Bot,
  User,
  Loader2,
} from "lucide-react";
import useOpenAIRealtime, { Conversation } from "@/lib/hooks/useOpenAIRealtime";
import { cn } from "@/lib/utils";

interface AITutorProps {
  courseTitle?: string;
  currentMaterial?: string;
  onExplainMaterial?: (material: string) => void;
  onExplainProblem?: (problem: string) => void;
}

export interface AITutorRef {
  explainMaterial: (material: string) => void;
  explainProblem: (problem: string) => void;
}

export const AITutor = forwardRef<AITutorRef, AITutorProps>(
  (
    { courseTitle, currentMaterial, onExplainMaterial, onExplainProblem },
    ref
  ) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [textInput, setTextInput] = useState("");
    const [isMuted, setIsMuted] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const conversationEndRef = useRef<HTMLDivElement>(null);
    const dragRef = useRef<HTMLDivElement>(null);

    const {
      status,
      isSessionActive,
      handleStartStopClick,
      conversation,
      sendTextMessage,
      currentVolume,
      isListening,
      isRecording,
      startRecording,
      stopRecording,
      explainMaterial,
      explainProblem,
    } = useOpenAIRealtime("alloy");

    useImperativeHandle(ref, () => ({
      explainMaterial,
      explainProblem,
    }));

    // Load saved position from localStorage
    useEffect(() => {
      if (typeof window === "undefined") return;

      const savedPosition = localStorage.getItem("ai-tutor-position");
      if (savedPosition) {
        const parsed = JSON.parse(savedPosition);
        // Validate saved position is still within bounds
        const buttonSize = 56; // w-14 h-14 = 56px (3.5rem)
        const margin = 24; // Extra margin to ensure button stays visible
        const maxX = window.innerWidth - buttonSize - margin;
        const maxY = window.innerHeight - buttonSize - margin;

        setPosition({
          x: Math.max(margin, Math.min(parsed.x, maxX)),
          y: Math.max(margin, Math.min(parsed.y, maxY)),
        });
      } else {
        // Default position (bottom-right with some margin)
        const buttonSize = 56; // w-14 h-14 = 56px (3.5rem)
        const margin = 24; // Extra margin to ensure button stays visible
        setPosition({
          x: window.innerWidth - buttonSize - margin,
          y: window.innerHeight - buttonSize - margin,
        });
      }
    }, []);

    // Save position to localStorage
    useEffect(() => {
      if (typeof window === "undefined") return;
      localStorage.setItem("ai-tutor-position", JSON.stringify(position));
    }, [position]);

    const handleMouseDown = useCallback(
      (e: React.MouseEvent) => {
        if (isExpanded) return; // Don't drag when expanded

        setIsDragging(true);
        setDragStart({
          x: e.clientX - position.x,
          y: e.clientY - position.y,
        });
        e.preventDefault();
      },
      [position, isExpanded]
    );

    const handleTouchStart = useCallback(
      (e: React.TouchEvent) => {
        if (isExpanded) return; // Don't drag when expanded

        const touch = e.touches[0];
        setIsDragging(true);
        setDragStart({
          x: touch.clientX - position.x,
          y: touch.clientY - position.y,
        });
        e.preventDefault();
      },
      [position, isExpanded]
    );

    const handleTouchMove = useCallback(
      (e: TouchEvent) => {
        if (!isDragging || typeof window === "undefined") return;

        const touch = e.touches[0];
        const newX = touch.clientX - dragStart.x;
        const newY = touch.clientY - dragStart.y;

        // Constrain to viewport boundaries
        const buttonSize = 56; // w-14 h-14 = 56px (3.5rem)
        const margin = 24; // Extra margin to ensure button stays visible
        const maxX = window.innerWidth - buttonSize - margin;
        const maxY = window.innerHeight - buttonSize - margin;

        setPosition({
          x: Math.max(margin, Math.min(newX, maxX)),
          y: Math.max(margin, Math.min(newY, maxY)),
        });
        e.preventDefault();
      },
      [isDragging, dragStart]
    );

    const handleMouseMove = useCallback(
      (e: MouseEvent) => {
        if (!isDragging || typeof window === "undefined") return;

        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;

        // Constrain to viewport boundaries
        const buttonSize = 56; // w-14 h-14 = 56px (3.5rem)
        const margin = 24; // Extra margin to ensure button stays visible
        const maxX = window.innerWidth - buttonSize - margin;
        const maxY = window.innerHeight - buttonSize - margin;

        setPosition({
          x: Math.max(margin, Math.min(newX, maxX)),
          y: Math.max(margin, Math.min(newY, maxY)),
        });
      },
      [isDragging, dragStart]
    );

    const handleMouseUp = useCallback(() => {
      if (isDragging && typeof window !== "undefined") {
        // Snap to nearest edge for better UX with proper bounds
        const buttonSize = 56; // w-14 h-14 = 56px (3.5rem)
        const margin = 24; // Extra margin to ensure button stays visible

        const centerX = position.x + buttonSize / 2;
        const snapToRight = centerX > window.innerWidth / 2;

        const maxX = window.innerWidth - buttonSize - margin;
        const maxY = window.innerHeight - buttonSize - margin;

        const newX = snapToRight ? Math.max(margin, maxX) : margin;
        const newY = Math.max(margin, Math.min(position.y, maxY));

        setPosition({
          x: newX,
          y: newY,
        });
      }
      setIsDragging(false);
    }, [isDragging, position]);

    // Add global mouse and touch event listeners
    useEffect(() => {
      if (isDragging) {
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
        document.addEventListener("touchmove", handleTouchMove, {
          passive: false,
        });
        document.addEventListener("touchend", handleMouseUp);

        return () => {
          document.removeEventListener("mousemove", handleMouseMove);
          document.removeEventListener("mouseup", handleMouseUp);
          document.removeEventListener("touchmove", handleTouchMove);
          document.removeEventListener("touchend", handleMouseUp);
        };
      }
    }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

    // Handle window resize to keep button in bounds
    useEffect(() => {
      if (typeof window === "undefined") return;

      let resizeTimeout: NodeJS.Timeout;
      const handleResize = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          setPosition((prev) => {
            const buttonSize = 56; // w-14 h-14 = 56px (3.5rem)
            const margin = 24; // Extra margin to ensure button stays visible
            const maxX = window.innerWidth - buttonSize - margin;
            const maxY = window.innerHeight - buttonSize - margin;

            return {
              x: Math.max(margin, Math.min(prev.x, maxX)),
              y: Math.max(margin, Math.min(prev.y, maxY)),
            };
          });
        }, 100); // Debounce resize events
      };

      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
        clearTimeout(resizeTimeout);
      };
    }, []);

    useEffect(() => {
      if (conversationEndRef.current) {
        conversationEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, [conversation]);

    const handleSendText = () => {
      if (textInput.trim() && isSessionActive) {
        sendTextMessage(textInput.trim());
        setTextInput("");
      }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendText();
      }
    };

    const handleExplainMaterial = () => {
      if (currentMaterial) {
        explainMaterial(currentMaterial);
        setIsExpanded(true);
      }
    };

    const VolumeIndicator = () => (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "w-1 h-4 bg-gray-300 rounded-full transition-colors duration-150",
              currentVolume > i * 20 && "bg-blue-500"
            )}
          />
        ))}
      </div>
    );

    if (!isExpanded) {
      return (
        <div
          ref={dragRef}
          className="fixed z-50 select-none"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            cursor: isDragging ? "grabbing" : "grab",
          }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          <div className="flex flex-col items-end gap-2">
            {(status || isRecording) && (
              <div className="bg-white px-3 py-1 rounded-lg shadow-lg border text-sm text-gray-600 max-w-xs">
                {isRecording ? "🎤 Mendengarkan..." : status}
              </div>
            )}

            <div className="flex gap-2">
              {currentMaterial && (
                <Button
                  onClick={handleExplainMaterial}
                  variant="outline"
                  size="sm"
                  className="bg-white shadow-lg hover:bg-blue-50"
                  disabled={!isSessionActive}
                >
                  <Bot className="w-4 h-4 mr-1" />
                  Jelaskan Materi
                </Button>
              )}

              <Button
                onClick={() => setIsExpanded(true)}
                variant="outline"
                size="sm"
                className="bg-white shadow-lg hover:bg-blue-50"
              >
                <MessageCircle className="w-4 h-4 mr-1" />
                AI Tutor
              </Button>
            </div>

            <Button
              onClick={(e) => {
                // Prevent click during drag
                if (isDragging) {
                  e.preventDefault();
                  return;
                }

                if (isSessionActive) {
                  if (isRecording) {
                    stopRecording();
                  } else {
                    startRecording();
                  }
                } else {
                  handleStartStopClick();
                }
              }}
              className={cn(
                "w-14 h-14 rounded-full shadow-lg transition-all duration-200 relative",
                !isSessionActive
                  ? "bg-blue-500 hover:bg-blue-600"
                  : isRecording
                  ? "bg-red-500 hover:bg-red-600 animate-pulse ring-4 ring-red-300"
                  : "bg-green-500 hover:bg-green-600",
                isDragging && "scale-110 shadow-2xl"
              )}
            >
              {!isSessionActive ? (
                <Bot className="w-6 h-6" />
              ) : isRecording ? (
                <MicOff className="w-6 h-6" />
              ) : (
                <Mic className="w-6 h-6" />
              )}

              {/* Drag indicator dots */}
              <div className="absolute -bottom-1 -right-1 flex gap-0.5">
                <div className="w-1 h-1 bg-white/50 rounded-full"></div>
                <div className="w-1 h-1 bg-white/50 rounded-full"></div>
                <div className="w-1 h-1 bg-white/50 rounded-full"></div>
              </div>
            </Button>
          </div>
        </div>
      );
    }

    // Calculate expanded position to avoid going off-screen
    const expandedStyle =
      typeof window !== "undefined"
        ? (() => {
            const modalWidth = 384; // w-96 = 384px
            const modalHeight = 500; // Approximate modal height
            const margin = 24; // Extra margin to ensure modal stays visible

            // Determine best position based on button location
            const buttonSize = 56; // w-14 h-14 = 56px (3.5rem)
            let left = position.x - modalWidth + buttonSize; // Align right edge with button
            let top = position.y - modalHeight / 2; // Center vertically with button

            // If button is on left side, show modal to the right
            if (position.x < window.innerWidth / 2) {
              left = position.x + buttonSize + margin; // Show to the right of button
            }

            // Constrain to viewport
            left = Math.max(
              margin,
              Math.min(left, window.innerWidth - modalWidth - margin)
            );
            top = Math.max(
              margin,
              Math.min(top, window.innerHeight - modalHeight - margin)
            );

            return { left, top };
          })()
        : { left: 0, top: 0 };

    return (
      <div className="fixed z-50 w-96" style={expandedStyle}>
        <Card className="shadow-2xl border-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Bot className="w-5 h-5 text-blue-500" />
                AI Tutor
                {isSessionActive && (
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                )}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setIsMuted(!isMuted)}
                  variant="ghost"
                  size="sm"
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  onClick={() => setIsExpanded(false)}
                  variant="ghost"
                  size="sm"
                >
                  ×
                </Button>
              </div>
            </div>

            {status && (
              <div className="text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded">
                {status}
              </div>
            )}
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Button
                  onClick={handleStartStopClick}
                  className={cn(
                    "flex-1 mr-2",
                    isSessionActive
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-blue-500 hover:bg-blue-600"
                  )}
                >
                  {isSessionActive ? (
                    <>
                      <MicOff className="w-4 h-4 mr-2" />
                      Akhiri Sesi
                    </>
                  ) : (
                    <>
                      <Bot className="w-4 h-4 mr-2" />
                      Mulai Sesi
                    </>
                  )}
                </Button>

                {isSessionActive && <VolumeIndicator />}
              </div>

              {isSessionActive && (
                <div className="flex gap-2">
                  <Button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={cn(
                      "flex-1",
                      isRecording
                        ? "bg-red-500 hover:bg-red-600 animate-pulse"
                        : "bg-green-500 hover:bg-green-600"
                    )}
                  >
                    {isRecording ? (
                      <>
                        <MicOff className="w-4 h-4 mr-2" />
                        Selesai Berbicara
                      </>
                    ) : (
                      <>
                        <Mic className="w-4 h-4 mr-2" />
                        Mulai Berbicara
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>

            {currentMaterial && (
              <div className="flex gap-2">
                <Button
                  onClick={handleExplainMaterial}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  disabled={!isSessionActive}
                >
                  <Bot className="w-3 h-3 mr-1" />
                  Jelaskan Materi
                </Button>
              </div>
            )}

            <div className="h-64 overflow-y-auto border rounded-lg p-3 bg-gray-50 space-y-2">
              {conversation.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <Bot className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">
                    Mulai sesi untuk berbicara dengan AI Tutor
                  </p>
                </div>
              ) : (
                conversation.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex gap-2 mb-2",
                      msg.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[80%] p-2 rounded-lg text-sm",
                        msg.role === "user"
                          ? "bg-blue-500 text-white rounded-br-sm"
                          : "bg-white border rounded-bl-sm",
                        !msg.isFinal && "opacity-70"
                      )}
                    >
                      <div className="flex items-start gap-2">
                        {msg.role === "assistant" && (
                          <Bot className="w-3 h-3 mt-0.5 text-blue-500" />
                        )}
                        {msg.role === "user" && (
                          <User className="w-3 h-3 mt-0.5" />
                        )}
                        <div>
                          {msg.text || (
                            <div className="flex items-center gap-1">
                              <Loader2 className="w-3 h-3 animate-spin" />
                              <span>Memproses...</span>
                            </div>
                          )}
                          {msg.status && !msg.isFinal && (
                            <div className="text-xs opacity-70 mt-1">
                              {msg.status === "speaking" &&
                                "🎤 Mendengarkan..."}
                              {msg.status === "processing" && "🤔 Memproses..."}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={conversationEndRef} />
            </div>

            <div className="flex gap-2">
              <Input
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ketik pesan untuk AI Tutor..."
                disabled={!isSessionActive}
                className="flex-1"
              />
              <Button
                onClick={handleSendText}
                disabled={!isSessionActive || !textInput.trim()}
                size="sm"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
);
