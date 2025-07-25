"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

export interface Conversation {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: string;
  isFinal: boolean;
  status?: "speaking" | "processing" | "final";
}

interface UseOpenAIRealtimeReturn {
  status: string;
  isSessionActive: boolean;
  startSession: () => Promise<void>;
  stopSession: () => void;
  handleStartStopClick: () => void;
  conversation: Conversation[];
  sendTextMessage: (text: string) => void;
  currentVolume: number;
  isListening: boolean;
  isRecording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
  explainMaterial: (material: string) => void;
  explainProblem: (problem: string) => void;
}

export default function useOpenAIRealtime(
  voice: string = "alloy"
): UseOpenAIRealtimeReturn {
  const [status, setStatus] = useState("");
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [conversation, setConversation] = useState<Conversation[]>([]);
  const [currentVolume, setCurrentVolume] = useState(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  const assistantAudioRef = useRef<HTMLAudioElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const volumeIntervalRef = useRef<number | null>(null);
  const ephemeralUserMessageIdRef = useRef<string | null>(null);

  const getVolume = useCallback(() => {
    if (!analyserRef.current) return 0;
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    const average =
      dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
    return Math.min(100, (average / 128) * 100);
  }, []);

  const updateEphemeralUserMessage = useCallback(
    (update: Partial<Conversation>) => {
      if (!ephemeralUserMessageIdRef.current) {
        const newId = uuidv4();
        ephemeralUserMessageIdRef.current = newId;
        const newMessage: Conversation = {
          id: newId,
          role: "user",
          text: update.text || "",
          timestamp: new Date().toISOString(),
          isFinal: false,
          status: update.status || "speaking",
        };
        setConversation((prev) => [...prev, newMessage]);
      } else {
        setConversation((prev) =>
          prev.map((msg) =>
            msg.id === ephemeralUserMessageIdRef.current
              ? { ...msg, ...update }
              : msg
          )
        );
      }
    },
    []
  );

  const clearEphemeralUserMessage = useCallback(() => {
    ephemeralUserMessageIdRef.current = null;
  }, []);

  const configureDataChannel = useCallback((dataChannel: RTCDataChannel) => {
    const sessionUpdate = {
      type: "session.update",
      session: {
        modalities: ["text", "audio"],
        input_audio_transcription: {
          model: "whisper-1",
        },
        input_audio_format: "pcm16",
        turn_detection: null, // Disable automatic turn detection
      },
    };
    dataChannel.send(JSON.stringify(sessionUpdate));
  }, []);

  const startRecording = useCallback(() => {
    if (!dataChannelRef.current || !isSessionActive) return;

    setIsRecording(true);
    setIsListening(true);

    // Clear any existing ephemeral message
    ephemeralUserMessageIdRef.current = null;

    updateEphemeralUserMessage({
      text: "Mendengarkan...",
      status: "speaking",
    });
  }, [isSessionActive, updateEphemeralUserMessage]);

  const stopRecording = useCallback(() => {
    if (!dataChannelRef.current || !isRecording) return;

    setIsRecording(false);
    setIsListening(false);

    // Commit the audio buffer and create response
    const commitMessage = {
      type: "input_audio_buffer.commit",
    };
    dataChannelRef.current.send(JSON.stringify(commitMessage));

    const responseCreate = {
      type: "response.create",
    };
    dataChannelRef.current.send(JSON.stringify(responseCreate));

    updateEphemeralUserMessage({
      text: "Memproses ucapan...",
      status: "processing",
    });
  }, [isRecording, updateEphemeralUserMessage]);

  const handleDataChannelMessage = useCallback(
    async (event: MessageEvent) => {
      try {
        const msg = JSON.parse(event.data);

        switch (msg.type) {
          case "input_audio_buffer.committed":
            updateEphemeralUserMessage({
              text: "Memproses ucapan...",
              status: "processing",
            });
            break;

          case "conversation.item.input_audio_transcription":
            const partialText =
              msg.transcript ?? msg.text ?? "Sedang berbicara...";
            updateEphemeralUserMessage({
              text: partialText,
              status: "speaking",
              isFinal: false,
            });
            break;

          case "conversation.item.input_audio_transcription.completed":
            updateEphemeralUserMessage({
              text: msg.transcript || "",
              isFinal: true,
              status: "final",
            });
            clearEphemeralUserMessage();
            break;

          case "response.audio_transcript.delta":
            const newMessage: Conversation = {
              id: uuidv4(),
              role: "assistant",
              text: msg.delta,
              timestamp: new Date().toISOString(),
              isFinal: false,
            };

            setConversation((prev) => {
              const lastMsg = prev[prev.length - 1];
              if (lastMsg && lastMsg.role === "assistant" && !lastMsg.isFinal) {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  ...lastMsg,
                  text: lastMsg.text + msg.delta,
                };
                return updated;
              } else {
                return [...prev, newMessage];
              }
            });
            break;

          case "response.audio_transcript.done":
            setConversation((prev) => {
              if (prev.length === 0) return prev;
              const updated = [...prev];
              updated[updated.length - 1].isFinal = true;
              return updated;
            });
            break;

          default:
            break;
        }
      } catch (error) {
        console.error("Error handling data channel message:", error);
      }
    },
    [updateEphemeralUserMessage, clearEphemeralUserMessage]
  );

  const startSession = useCallback(async () => {
    try {
      setStatus("Memulai sesi AI Tutor...");

      const sessionResponse = await fetch("/api/openai/session", {
        method: "POST",
      });

      if (!sessionResponse.ok) {
        throw new Error("Failed to create session");
      }

      const sessionData = await sessionResponse.json();
      const ephemeralToken = sessionData.client_secret.value;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;

      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;

      setStatus("Menghubungkan ke AI...");
      const pc = new RTCPeerConnection();
      peerConnectionRef.current = pc;

      let audioEl = assistantAudioRef.current;
      if (!audioEl) {
        audioEl = document.createElement("audio");
        audioEl.autoplay = true;
        assistantAudioRef.current = audioEl;
      }

      pc.ontrack = (event) => {
        audioEl!.srcObject = event.streams[0];

        const audioCtx = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
        const src = audioCtx.createMediaStreamSource(event.streams[0]);
        const inboundAnalyzer = audioCtx.createAnalyser();
        inboundAnalyzer.fftSize = 256;
        src.connect(inboundAnalyzer);
        analyserRef.current = inboundAnalyzer;

        volumeIntervalRef.current = window.setInterval(() => {
          setCurrentVolume(getVolume());
        }, 100);
      };

      const dataChannel = pc.createDataChannel("response");
      dataChannelRef.current = dataChannel;

      dataChannel.onopen = () => {
        configureDataChannel(dataChannel);
      };
      dataChannel.onmessage = handleDataChannelMessage;

      pc.addTrack(stream.getTracks()[0]);

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const baseUrl = "https://api.openai.com/v1/realtime";
      const model = "gpt-4o-mini-realtime-preview-2024-12-17";
      const response = await fetch(`${baseUrl}?model=${model}&voice=${voice}`, {
        method: "POST",
        body: offer.sdp,
        headers: {
          Authorization: `Bearer ${ephemeralToken}`,
          "Content-Type": "application/sdp",
        },
      });

      const answerSdp = await response.text();
      await pc.setRemoteDescription({ type: "answer", sdp: answerSdp });

      setIsSessionActive(true);
      setStatus("AI Tutor siap membantu!");
    } catch (err) {
      console.error("startSession error:", err);
      setStatus(`Error: ${err}`);
      stopSession();
    }
  }, [voice, configureDataChannel, handleDataChannelMessage, getVolume]);

  const stopSession = useCallback(() => {
    if (dataChannelRef.current) {
      dataChannelRef.current.close();
      dataChannelRef.current = null;
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((track) => track.stop());
      audioStreamRef.current = null;
    }
    if (volumeIntervalRef.current) {
      clearInterval(volumeIntervalRef.current);
      volumeIntervalRef.current = null;
    }

    analyserRef.current = null;
    setIsSessionActive(false);
    setIsListening(false);
    setIsRecording(false);
    setCurrentVolume(0);
    setStatus("");
  }, []);

  const handleStartStopClick = useCallback(() => {
    if (isSessionActive) {
      stopSession();
    } else {
      startSession();
    }
  }, [isSessionActive, startSession, stopSession]);

  const sendTextMessage = useCallback((text: string) => {
    if (!dataChannelRef.current) return;

    const message = {
      type: "conversation.item.create",
      item: {
        type: "message",
        role: "user",
        content: [{ type: "input_text", text }],
      },
    };

    dataChannelRef.current.send(JSON.stringify(message));

    const responseCreate = {
      type: "response.create",
    };
    dataChannelRef.current.send(JSON.stringify(responseCreate));

    const userMessage: Conversation = {
      id: uuidv4(),
      role: "user",
      text,
      timestamp: new Date().toISOString(),
      isFinal: true,
    };
    setConversation((prev) => [...prev, userMessage]);
  }, []);

  const explainMaterial = useCallback(
    (material: string) => {
      const message = `Tolong jelaskan materi ini dengan cara yang mudah dipahami anak SD: ${material}`;
      sendTextMessage(message);
    },
    [sendTextMessage]
  );

  const explainProblem = useCallback(
    (problem: string) => {
      const message = `Tolong bantu saya memahami soal ini step by step: ${problem}`;
      sendTextMessage(message);
    },
    [sendTextMessage]
  );

  useEffect(() => {
    return () => {
      stopSession();
    };
  }, [stopSession]);

  return {
    status,
    isSessionActive,
    startSession,
    stopSession,
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
  };
}
