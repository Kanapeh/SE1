'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff, 
  Monitor, 
  MonitorOff,
  Volume2,
  VolumeX,
  Settings,
  MessageCircle,
  Users,
  Clock,
  Maximize2,
  Minimize2,
  RotateCcw,
  Camera,
  CameraOff,
  Speaker,
  AlertCircle,
  Send,
  X,
  Keyboard,
  Palette,
  Eraser,
  Square,
  Circle,
  PenTool,
  Type,
  Undo,
  Redo,
  Download,
  Upload,
  MessageSquare,
  UserCheck,
  Wifi,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getMediaDeviceError, type MediaDeviceError } from '@/app/utils/videoHelpers';
import CameraPermissionGuide from './CameraPermissionGuide';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface VideoCallProps {
  isTeacher?: boolean;
  studentId?: string;
  teacherId?: string;
  classId?: string;
  teacherName?: string;
  studentName?: string;
  onCallEnd?: () => void;
  onCallStart?: () => void;
}

interface CallState {
  isConnected: boolean;
  isConnecting: boolean;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  isScreenSharing: boolean;
  isMuted: boolean;
  isFullscreen: boolean;
  callDuration: number;
  connectionQuality: 'excellent' | 'good' | 'poor' | 'disconnected';
}

interface ParticipantInfo {
  id: string;
  name: string;
  role: 'teacher' | 'student';
  avatar?: string;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
}

export default function VideoCall({ 
  isTeacher = false, 
  studentId, 
  teacherId, 
  classId,
  teacherName,
  studentName,
  onCallEnd,
  onCallStart 
}: VideoCallProps) {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const [callState, setCallState] = useState<CallState>({
    isConnected: false,
    isConnecting: false,
    isVideoEnabled: true,
    isAudioEnabled: true,
    isScreenSharing: false,
    isMuted: false,
    isFullscreen: false,
    callDuration: 0,
    connectionQuality: 'excellent'
  });

  const [participants, setParticipants] = useState<ParticipantInfo[]>([
    {
      id: isTeacher ? teacherId || 'teacher-1' : studentId || 'student-1',
      name: isTeacher ? (teacherName || 'معلم') : (studentName || 'دانش‌آموز'),
      role: isTeacher ? 'teacher' : 'student',
      isVideoEnabled: true,
      isAudioEnabled: true
    }
  ]);

  const [chatMessages, setChatMessages] = useState<Array<{
    id: string;
    sender: string;
    message: string;
    timestamp: Date;
  }>>([]);

  const [showChat, setShowChat] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [mediaError, setMediaError] = useState<MediaDeviceError | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showPermissionGuide, setShowPermissionGuide] = useState(false);
  const [showFakeTeacher, setShowFakeTeacher] = useState(false);
  const [showWhiteboard, setShowWhiteboard] = useState(false);
  const [drawingTool, setDrawingTool] = useState<'pen' | 'eraser' | 'text' | 'shape'>('pen');
  const [drawingColor, setDrawingColor] = useState('#000000');
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingHistory, setDrawingHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isAddingText, setIsAddingText] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);

  // Start timer when call connects
  useEffect(() => {
    if (callState.isConnected && !startTime) {
      setStartTime(new Date());
    } else if (!callState.isConnected) {
      setStartTime(null);
      setCallDuration(0);
    }
  }, [callState.isConnected, startTime]);

  // Update timer every second
  useEffect(() => {
    if (!startTime) return;

    const interval = setInterval(() => {
      const now = new Date();
      const diff = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      setCallDuration(diff);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  // Format duration
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // Initialize media stream
  useEffect(() => {
    const initializeMedia = async () => {
      try {
        // Get the proper site URL from environment or fallback to current origin
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
        
        // Check if using non-localhost IP (common issue)
        if (location.hostname !== 'localhost' && !location.hostname.startsWith('192.168.') && !location.hostname.startsWith('172.') && !location.hostname.startsWith('10.') && location.protocol !== 'https:') {
          console.error('Using IP address instead of localhost - this causes getUserMedia issues');
          alert(
            `از localhost استفاده کنید: ${siteUrl}/students/temp-user-id/video-call`,
          );
          return;
        }

        // Check if mediaDevices is available
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          console.error('getUserMedia is not supported in this browser');
          const browserError = {
            type: 'not-supported' as const,
            message: 'مرورگر شما از تماس تصویری پشتیبانی نمی‌کند',
            suggestions: [
              'از مرورگر جدیدتری استفاده کنید (Chrome، Firefox، Safari، Edge)',
              'مرورگر خود را به‌روزرسانی کنید',
              'JavaScript را فعال کنید',
              'تنظیمات امنیتی مرورگر را بررسی کنید'
            ]
          };
          setMediaError(browserError);
          setShowPermissionGuide(true);
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: callState.isVideoEnabled, 
          audio: callState.isAudioEnabled 
        });
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
          // Force the video to play
          try {
            await localVideoRef.current.play();
            setIsInitialized(true);
          } catch (playError) {
            console.log('Video play failed, will try again:', playError);
            // Try again after a short delay
            setTimeout(async () => {
              try {
                if (localVideoRef.current) {
                  await localVideoRef.current.play();
                  setIsInitialized(true);
                }
              } catch (retryError) {
                console.error('Video play retry failed:', retryError);
              }
            }, 1000);
          }
        }
      } catch (error: any) {
        const mediaError = getMediaDeviceError(error);
        setMediaError(mediaError);
        
        // Show permission guide for permission-related errors
        if (mediaError.type === 'no-permission' || mediaError.type === 'https-required') {
          setShowPermissionGuide(true);
        }
      }
    };

    // Only initialize if we're in the browser
    if (typeof window !== 'undefined') {
      // Additional checks for older browsers
      if (typeof navigator === 'undefined') {
        console.error('Navigator not available');
        const navError = {
          type: 'not-supported' as const,
          message: 'محیط اجرا از تماس تصویری پشتیبانی نمی‌کند',
          suggestions: [
            'در مرورگر وب اجرا کنید',
            'از مرورگر مدرن استفاده کنید',
            'JavaScript را فعال کنید'
          ]
        };
        setMediaError(navError);
        return;
      }
      
      initializeMedia();
    }
  }, [callState.isVideoEnabled, callState.isAudioEnabled]);

  // Ensure stream is maintained during call
  useEffect(() => {
    const ensureStreamInCall = async () => {
      if (callState.isConnected && localVideoRef.current && !localVideoRef.current.srcObject) {
        try {
          console.log('Re-initializing stream for active call...');
          const stream = await navigator.mediaDevices.getUserMedia({
            video: callState.isVideoEnabled,
            audio: callState.isAudioEnabled
          });
          
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
            await localVideoRef.current.play();
            console.log('Stream successfully restored in call');
          }
        } catch (error) {
          console.error('Failed to restore stream in call:', error);
        }
      }
    };

    ensureStreamInCall();
  }, [callState.isConnected, callState.isVideoEnabled, callState.isAudioEnabled]);

  // Initialize canvas
  useEffect(() => {
    if (canvasRef.current && showWhiteboard) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (context) {
        // Set canvas size
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        
        // Set initial styles
        context.strokeStyle = drawingColor;
        context.lineWidth = 2;
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.globalCompositeOperation = 'source-over';
        
        // Fill with transparent background
        context.fillStyle = 'rgba(255, 255, 255, 0.1)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        contextRef.current = context;
        
        // Save initial state
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        setDrawingHistory([imageData]);
        setHistoryIndex(0);
        
        console.log('Canvas initialized:', canvas.width, 'x', canvas.height);
      }
    }
  }, [showWhiteboard]);

  // Update drawing settings when tool or color changes
  useEffect(() => {
    if (contextRef.current) {
      if (drawingTool === 'eraser') {
        contextRef.current.globalCompositeOperation = 'destination-out';
        contextRef.current.lineWidth = 20;
      } else {
        contextRef.current.globalCompositeOperation = 'source-over';
        contextRef.current.lineWidth = 2;
        contextRef.current.strokeStyle = drawingColor;
      }
      console.log('Drawing settings updated:', drawingTool, drawingColor);
    }
  }, [drawingTool, drawingColor]);

  const formatCallDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const retryMediaAccess = async () => {
    try {
      setMediaError(null);
      setIsInitialized(false);
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        await localVideoRef.current.play();
        setIsInitialized(true);
        setShowPermissionGuide(false);
      }
    } catch (error: any) {
      const mediaError = getMediaDeviceError(error);
      setMediaError(mediaError);
      
      if (mediaError.type === 'no-permission' || mediaError.type === 'https-required') {
        setShowPermissionGuide(true);
      }
    }
  };

  const toggleVideo = async () => {
    try {
      const newVideoState = !callState.isVideoEnabled;
      setCallState(prev => ({ ...prev, isVideoEnabled: newVideoState }));
      
      // If we have a current stream, update the video track
      if (localVideoRef.current && localVideoRef.current.srcObject) {
        const stream = localVideoRef.current.srcObject as MediaStream;
        const videoTracks = stream.getVideoTracks();
        videoTracks.forEach(track => {
          track.enabled = newVideoState;
        });
        
        // If turning on video and no video tracks, get new stream
        if (newVideoState && videoTracks.length === 0) {
          const newStream = await navigator.mediaDevices.getUserMedia({ 
            video: true, 
            audio: callState.isAudioEnabled 
          });
          localVideoRef.current.srcObject = newStream;
          await localVideoRef.current.play();
        }
      } else if (newVideoState) {
        // No stream exists, create a new one
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: callState.isAudioEnabled 
        });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
          await localVideoRef.current.play();
        }
      }
    } catch (error) {
      console.error('Error toggling video:', error);
    }
  };

  const toggleAudio = async () => {
    try {
      const newAudioState = !callState.isAudioEnabled;
      setCallState(prev => ({ ...prev, isAudioEnabled: newAudioState }));
      
      // If we have a current stream, update the audio track
      if (localVideoRef.current && localVideoRef.current.srcObject) {
        const stream = localVideoRef.current.srcObject as MediaStream;
        const audioTracks = stream.getAudioTracks();
        audioTracks.forEach(track => {
          track.enabled = newAudioState;
        });
      }
    } catch (error) {
      console.error('Error toggling audio:', error);
    }
  };

  const toggleScreenShare = async () => {
    try {
      const newScreenShareState = !callState.isScreenSharing;
      
      if (newScreenShareState) {
        // Start screen sharing
        if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
          const screenStream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: true
          });
          
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = screenStream;
          }
          
          // Listen for screen share end
          screenStream.getVideoTracks()[0].addEventListener('ended', () => {
            setCallState(prev => ({ ...prev, isScreenSharing: false }));
            // Switch back to camera
            const initializeCamera = async () => {
              if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                const cameraStream = await navigator.mediaDevices.getUserMedia({
                  video: callState.isVideoEnabled,
                  audio: callState.isAudioEnabled
                });
                if (localVideoRef.current) {
                  localVideoRef.current.srcObject = cameraStream;
                }
              }
            };
            initializeCamera();
          });
        }
      } else {
        // Stop screen sharing and switch back to camera
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const cameraStream = await navigator.mediaDevices.getUserMedia({
            video: callState.isVideoEnabled,
            audio: callState.isAudioEnabled
          });
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = cameraStream;
          }
        }
      }
      
      setCallState(prev => ({ ...prev, isScreenSharing: newScreenShareState }));
    } catch (error) {
      console.error('Error toggling screen share:', error);
    }
  };

  // Initialize WebRTC connection
  const initializeWebRTC = async () => {
    if (!classId) {
      console.error('Class ID is required for WebRTC');
      return;
    }

    try {
      // Get local media stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: callState.isVideoEnabled,
        audio: callState.isAudioEnabled
      });
      
      localStreamRef.current = stream;
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        await localVideoRef.current.play();
      }

      // Create RTCPeerConnection with STUN servers
      const configuration: RTCConfiguration = {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
        ]
      };

      const peerConnection = new RTCPeerConnection(configuration);
      peerConnectionRef.current = peerConnection;

      // Add local stream tracks to peer connection
      stream.getTracks().forEach(track => {
        peerConnection.addTrack(track, stream);
      });

      // Handle remote stream
      peerConnection.ontrack = (event) => {
        console.log('Received remote track:', event);
        if (remoteVideoRef.current && event.streams[0]) {
          remoteVideoRef.current.srcObject = event.streams[0];
          remoteVideoRef.current.play().catch(err => {
            console.error('Error playing remote video:', err);
          });
        }
      };

      // Handle ICE candidates
      peerConnection.onicecandidate = (event) => {
        if (event.candidate && channelRef.current) {
          const candidateData = {
            type: 'ice-candidate',
            candidate: event.candidate,
            from: isTeacher ? teacherId : studentId,
            to: isTeacher ? studentId : teacherId,
            classId: classId
          };
          channelRef.current.send({
            type: 'broadcast',
            event: 'webrtc-signal',
            payload: candidateData
          });
        }
      };

      // Handle connection state changes
      peerConnection.onconnectionstatechange = () => {
        console.log('Connection state:', peerConnection.connectionState);
        if (peerConnection.connectionState === 'connected') {
          setCallState(prev => ({ 
            ...prev, 
            isConnecting: false, 
            isConnected: true,
            connectionQuality: 'excellent'
          }));
          onCallStart?.();
        } else if (peerConnection.connectionState === 'disconnected' || 
                   peerConnection.connectionState === 'failed') {
          setCallState(prev => ({ 
            ...prev, 
            connectionQuality: 'disconnected'
          }));
        }
      };

      // Create Supabase Realtime channel for signaling
      const channelName = `video-call-${classId}`;
      const channel = supabase.channel(channelName, {
        config: {
          broadcast: { self: true }
        }
      });

      // Listen for signaling messages
      channel.on('broadcast', { event: 'webrtc-signal' }, (payload) => {
        const data = payload.payload;
        
        // Ignore messages from self
        if (data.from === (isTeacher ? teacherId : studentId)) {
          return;
        }

        if (data.type === 'offer') {
          handleOffer(data.offer);
        } else if (data.type === 'answer') {
          handleAnswer(data.answer);
        } else if (data.type === 'ice-candidate') {
          handleIceCandidate(data.candidate);
        }
      });

      await channel.subscribe();
      channelRef.current = channel;

      // Create offer if teacher, wait for offer if student
      if (isTeacher) {
        // Teacher creates and sends offer
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        
        const offerData = {
          type: 'offer',
          offer: offer,
          from: teacherId,
          to: studentId,
          classId: classId
        };
        
        channel.send({
          type: 'broadcast',
          event: 'webrtc-signal',
          payload: offerData
        });
        console.log('✅ Teacher sent offer');
      } else {
        // Student waits for offer from teacher
        console.log('⏳ Student waiting for offer from teacher...');
        setCallState(prev => ({ 
          ...prev, 
          isConnecting: true 
        }));
      }

    } catch (error) {
      console.error('Error initializing WebRTC:', error);
      setCallState(prev => ({ ...prev, isConnecting: false }));
      const mediaError = getMediaDeviceError(error);
      setMediaError(mediaError);
    }
  };

  const handleOffer = async (offer: RTCSessionDescriptionInit) => {
    if (!peerConnectionRef.current) {
      console.error('Peer connection not initialized when receiving offer');
      return;
    }
    
    try {
      console.log('📥 Received offer, creating answer...');
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);
      
      if (channelRef.current) {
        const answerData = {
          type: 'answer',
          answer: answer,
          from: isTeacher ? teacherId : studentId,
          to: isTeacher ? studentId : teacherId,
          classId: classId
        };
        
        channelRef.current.send({
          type: 'broadcast',
          event: 'webrtc-signal',
          payload: answerData
        });
        console.log('✅ Answer sent');
      }
    } catch (error) {
      console.error('❌ Error handling offer:', error);
      setCallState(prev => ({ ...prev, isConnecting: false }));
    }
  };

  const handleAnswer = async (answer: RTCSessionDescriptionInit) => {
    if (!peerConnectionRef.current) {
      console.error('Peer connection not initialized when receiving answer');
      return;
    }
    
    try {
      console.log('📥 Received answer');
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
      console.log('✅ Remote description set');
    } catch (error) {
      console.error('❌ Error handling answer:', error);
    }
  };

  const handleIceCandidate = async (candidate: RTCIceCandidateInit) => {
    if (!peerConnectionRef.current) {
      console.warn('Peer connection not initialized when receiving ICE candidate');
      return;
    }
    
    try {
      await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      console.log('✅ ICE candidate added');
    } catch (error) {
      console.error('❌ Error handling ICE candidate:', error);
    }
  };

  const startCall = async () => {
    setCallState(prev => ({ ...prev, isConnecting: true }));
    await initializeWebRTC();
  };

  const endCall = () => {
    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    // Unsubscribe from channel
    if (channelRef.current) {
      channelRef.current.unsubscribe();
      channelRef.current = null;
    }

    // Stop all media streams
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      localStreamRef.current = null;
    }

    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => {
        track.stop();
      });
      localVideoRef.current.srcObject = null;
    }
    
    if (remoteVideoRef.current && remoteVideoRef.current.srcObject) {
      const stream = remoteVideoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => {
        track.stop();
      });
      remoteVideoRef.current.srcObject = null;
    }
    
    setCallState(prev => ({ 
      ...prev, 
      isConnected: false,
      callDuration: 0,
      isScreenSharing: false,
      isVideoEnabled: true,
      isAudioEnabled: true
    }));
    onCallEnd?.();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Close peer connection
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }

      // Unsubscribe from channel
      if (channelRef.current) {
        channelRef.current.unsubscribe();
        channelRef.current = null;
      }

      // Stop all media streams
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => {
          track.stop();
        });
        localStreamRef.current = null;
      }
    };
  }, []);

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now().toString(),
        sender: isTeacher ? 'teacher' : 'student',
        message: newMessage.trim(),
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, message]);
      setNewMessage('');
      
      // Simulate response from other party
      if (!isTeacher) {
        setTimeout(() => {
          const teacherResponse = {
            id: (Date.now() + 1).toString(),
            sender: 'teacher' as const,
            message: 'سوال خوبی است! اجازه دهید توضیح دهم...',
            timestamp: new Date()
          };
          setChatMessages(prev => [...prev, teacherResponse]);
        }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
      }
    }
  };

  // Canvas Drawing Functions
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    console.log('Start drawing called');
    if (!contextRef.current) {
      console.log('No context available');
      return;
    }
    
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) {
      console.log('No canvas available');
      return;
    }

    let clientX, clientY;
    
    if ('touches' in e) {
      // Touch event
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      clientX = touch.clientX - rect.left;
      clientY = touch.clientY - rect.top;
      console.log('Touch start:', clientX, clientY);
    } else {
      // Mouse event
      const rect = canvas.getBoundingClientRect();
      clientX = e.clientX - rect.left;
      clientY = e.clientY - rect.top;
      console.log('Mouse start:', clientX, clientY);
    }

    // Set drawing mode based on tool
    if (drawingTool === 'eraser') {
      contextRef.current.globalCompositeOperation = 'destination-out';
      contextRef.current.lineWidth = 20;
    } else {
      contextRef.current.globalCompositeOperation = 'source-over';
      contextRef.current.lineWidth = 2;
      contextRef.current.strokeStyle = drawingColor;
    }

    contextRef.current.beginPath();
    contextRef.current.moveTo(clientX, clientY);
    console.log('Drawing started with tool:', drawingTool, 'color:', drawingColor);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !contextRef.current) {
      console.log('Not drawing or no context');
      return;
    }
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    let clientX, clientY;
    
    if ('touches' in e) {
      // Touch event
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      clientX = touch.clientX - rect.left;
      clientY = touch.clientY - rect.top;
    } else {
      // Mouse event
      const rect = canvas.getBoundingClientRect();
      clientX = e.clientX - rect.left;
      clientY = e.clientY - rect.top;
    }

    console.log('Drawing at:', clientX, clientY);
    contextRef.current.lineTo(clientX, clientY);
    contextRef.current.stroke();
  };

  const stopDrawing = () => {
    console.log('Stop drawing called');
    if (!isDrawing || !contextRef.current) return;
    
    setIsDrawing(false);
    contextRef.current.closePath();
    
    // Reset composite operation
    contextRef.current.globalCompositeOperation = 'source-over';
    
    // Save to history
    const canvas = canvasRef.current;
    if (canvas && contextRef.current) {
      const imageData = contextRef.current.getImageData(0, 0, canvas.width, canvas.height);
      setDrawingHistory(prev => {
        const newHistory = prev.slice(0, historyIndex + 1);
        newHistory.push(imageData);
        setHistoryIndex(newHistory.length - 1);
        return newHistory;
      });
      console.log('Drawing saved to history');
    }
  };

  const clearCanvas = () => {
    if (!contextRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    contextRef.current.clearRect(0, 0, canvas.width, canvas.height);
    
    // Save to history
    const imageData = contextRef.current.getImageData(0, 0, canvas.width, canvas.height);
    setDrawingHistory(prev => {
      const newHistory = [...prev, imageData];
      setHistoryIndex(newHistory.length - 1);
      return newHistory;
    });
  };

  const undo = () => {
    if (historyIndex > 0 && contextRef.current && canvasRef.current) {
      const newIndex = historyIndex - 1;
      const imageData = drawingHistory[newIndex];
      contextRef.current.putImageData(imageData, 0, 0);
      setHistoryIndex(newIndex);
    }
  };

  const redo = () => {
    if (historyIndex < drawingHistory.length - 1 && contextRef.current && canvasRef.current) {
      const newIndex = historyIndex + 1;
      const imageData = drawingHistory[newIndex];
      contextRef.current.putImageData(imageData, 0, 0);
      setHistoryIndex(newIndex);
    }
  };

  const downloadCanvas = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = 'whiteboard.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  // Text Functions
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (drawingTool === 'text') {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      setTextPosition({ x, y });
      setIsAddingText(true);
    }
  };

  const addTextToCanvas = () => {
    if (!contextRef.current || !canvasRef.current || !textInput.trim()) return;
    
    const context = contextRef.current;
    const canvas = canvasRef.current;
    
    // Set text properties
    context.font = '20px Arial';
    context.fillStyle = drawingColor;
    context.textAlign = 'left';
    context.textBaseline = 'top';
    
    // Add text
    context.fillText(textInput, textPosition.x, textPosition.y);
    
    // Save to history
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    setDrawingHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(imageData);
      setHistoryIndex(newHistory.length - 1);
      return newHistory;
    });
    
    // Reset text state
    setTextInput('');
    setIsAddingText(false);
  };

  const cancelTextInput = () => {
    setTextInput('');
    setIsAddingText(false);
  };

  const getConnectionQualityColor = () => {
    switch (callState.connectionQuality) {
      case 'excellent': return 'text-green-500';
      case 'good': return 'text-yellow-500';
      case 'poor': return 'text-orange-500';
      case 'disconnected': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  // Prevent screen recording and screenshots
  useEffect(() => {
    const preventScreenCapture = () => {
      // Prevent right-click context menu
      document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        return false;
      });

      // Prevent keyboard shortcuts for screenshots
      document.addEventListener('keydown', (e) => {
        // Prevent Ctrl+Shift+I (Developer Tools)
        if (e.ctrlKey && e.shiftKey && e.key === 'I') {
          e.preventDefault();
          return false;
        }
        // Prevent F12 (Developer Tools)
        if (e.key === 'F12') {
          e.preventDefault();
          return false;
        }
        // Prevent Ctrl+Shift+C (Developer Tools)
        if (e.ctrlKey && e.shiftKey && e.key === 'C') {
          e.preventDefault();
          return false;
        }
        // Prevent Ctrl+U (View Source)
        if (e.ctrlKey && e.key === 'u') {
          e.preventDefault();
          return false;
        }
        // Prevent Ctrl+S (Save Page)
        if (e.ctrlKey && e.key === 's') {
          e.preventDefault();
          return false;
        }
        // Prevent Print Screen
        if (e.key === 'PrintScreen') {
          e.preventDefault();
          return false;
        }
      });

      // Prevent drag and drop
      document.addEventListener('dragstart', (e) => {
        e.preventDefault();
        return false;
      });

      // Prevent selection
      document.addEventListener('selectstart', (e) => {
        e.preventDefault();
        return false;
      });

      // Prevent copy
      document.addEventListener('copy', (e) => {
        e.preventDefault();
        return false;
      });

      // Prevent cut
      document.addEventListener('cut', (e) => {
        e.preventDefault();
        return false;
      });

      // Prevent paste
      document.addEventListener('paste', (e) => {
        e.preventDefault();
        return false;
      });

      // Disable text selection
      document.body.style.userSelect = 'none';
      (document.body.style as any).webkitUserSelect = 'none';
      (document.body.style as any).mozUserSelect = 'none';
      (document.body.style as any).msUserSelect = 'none';

      // Add CSS to prevent screen recording
      const style = document.createElement('style');
      style.textContent = `
        * {
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
          user-select: none !important;
          -webkit-touch-callout: none !important;
          -webkit-tap-highlight-color: transparent !important;
        }
        
        /* Prevent screen recording detection */
        video, canvas, img {
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
          user-select: none !important;
          pointer-events: none !important;
        }
        
        /* Allow interaction with buttons and controls */
        button, .button, [role="button"], .control-bar, .tooltip {
          pointer-events: auto !important;
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
          user-select: none !important;
        }
        
        /* Prevent screen recording software detection */
        @media screen and (max-width: 0px) {
          body { display: none !important; }
        }
        
        /* Disable print styles */
        @media print {
          * { display: none !important; }
        }
      `;
      document.head.appendChild(style);

      // Detect if page is being recorded or captured
      const detectRecording = () => {
        // Check for screen recording software
        const recordingIndicators = [
          'screen recording',
          'screen capture',
          'screencast',
          'recording',
          'capture'
        ];

        // Check page title and URL for recording indicators
        const pageInfo = document.title.toLowerCase() + ' ' + window.location.href.toLowerCase();
        if (recordingIndicators.some(indicator => pageInfo.includes(indicator))) {
          document.body.innerHTML = '<div style="text-align: center; padding: 50px; font-size: 24px; color: red;">Screen recording is not allowed!</div>';
        }

        // Check for developer tools
        const devtools = {
          open: false,
          orientation: null as string | null
        };

        const threshold = 160;
        const emitEvent = (isOpen: boolean, orientation: string | null) => {
          if (devtools.open !== isOpen) {
            devtools.open = isOpen;
            devtools.orientation = orientation;
            if (isOpen) {
              // Developer tools detected - show warning
              alert('Developer tools detected! Screen recording is not allowed.');
              document.body.innerHTML = '<div style="text-align: center; padding: 50px; font-size: 24px; color: red;">Developer tools detected! Screen recording is not allowed.</div>';
            }
          }
        };

        // Check window dimensions
        if (window.outerHeight - window.innerHeight > threshold || window.outerWidth - window.innerWidth > threshold) {
          emitEvent(true, 'vertical');
        } else {
          emitEvent(false, null);
        }
      };

      // Run detection periodically
      setInterval(detectRecording, 1000);
    };

    if (callState.isConnected) {
      preventScreenCapture();
    }

    return () => {
      // Cleanup event listeners when component unmounts
      document.removeEventListener('contextmenu', () => {});
      document.removeEventListener('keydown', () => {});
      document.removeEventListener('dragstart', () => {});
      document.removeEventListener('selectstart', () => {});
      document.removeEventListener('copy', () => {});
      document.removeEventListener('cut', () => {});
      document.removeEventListener('paste', () => {});
    };
  }, [callState.isConnected]);

  if (!callState.isConnected && !callState.isConnecting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        {/* Animated Background Particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/20 rounded-full animate-pulse"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-blue-300/30 rounded-full animate-bounce"></div>
          <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-purple-300/25 rounded-full animate-ping"></div>
          <div className="absolute top-2/3 right-1/4 w-1 h-1 bg-indigo-300/20 rounded-full animate-pulse"></div>
          <div className="absolute bottom-1/3 left-1/2 w-1 h-1 bg-white/15 rounded-full animate-bounce"></div>
        </div>

        {/* Connection Status Indicator */}
        {callState.isConnected && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-4 right-4 z-50"
          >
            <div className="flex items-center gap-2 bg-green-500/20 backdrop-blur-sm rounded-full px-3 py-1 border border-green-400/30">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-300 text-xs font-medium">متصل</span>
            </div>
          </motion.div>
        )}

        {/* Call Info Bar - Enhanced */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-4 left-1/2 transform -translate-x-1/2 z-40"
        >
          <div className="bg-white/20 backdrop-blur-md rounded-xl px-6 py-3 border border-white/20 shadow-lg">
            <div className="flex items-center gap-4 text-white">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-white" />
                <span className="font-semibold text-sm">1 شرکت کننده</span>
              </div>
              <div className="w-px h-4 bg-white/30"></div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-white" />
                <span className="font-semibold text-sm">{formatDuration(callDuration)}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Lesson Topic Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute top-20 left-1/2 transform -translate-x-1/2 z-40"
        >
          <div className="bg-gradient-to-r from-yellow-400/20 to-orange-400/20 backdrop-blur-sm rounded-full px-4 py-2 border border-yellow-400/30">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              <span className="text-yellow-200 text-sm font-medium">Grammar Point</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto p-8"
        >
          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
            <CardHeader className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                {isTeacher ? 'شروع کلاس آنلاین' : 'پیوستن به کلاس'}
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {isTeacher 
                  ? 'برای شروع کلاس با دانش‌آموز، روی دکمه شروع کلیک کنید'
                  : 'برای پیوستن به کلاس با معلم، روی دکمه پیوستن کلیک کنید'
                }
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Error Display */}
              {mediaError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <span className="text-sm text-red-700 dark:text-red-300">{mediaError.message}</span>
                  </div>
                  <div className="mt-2">
                    <p className="text-xs text-red-600 dark:text-red-400 mb-2">راه‌حل‌های پیشنهادی:</p>
                    <ul className="text-xs text-red-600 dark:text-red-400 space-y-1">
                      {mediaError.suggestions.map((suggestion, index) => (
                        <li key={index}>• {suggestion}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setMediaError(null)}
                      className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                      بستن
                    </Button>
                    <Button
                      size="sm"
                      onClick={retryMediaAccess}
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      تلاش مجدد
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowPermissionGuide(true)}
                      className="text-blue-600 border-blue-300"
                    >
                      راهنمای فعال‌سازی
                    </Button>
                  </div>
                </motion.div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className={`text-center p-3 rounded-lg ${
                  mediaError 
                    ? 'bg-red-50 dark:bg-red-900/20' 
                    : isInitialized 
                      ? 'bg-green-50 dark:bg-green-900/20' 
                      : 'bg-blue-50 dark:bg-blue-900/20'
                }`}>
                  {mediaError ? (
                    <CameraOff className="w-6 h-6 text-red-600 dark:text-red-400 mx-auto mb-2" />
                  ) : (
                    <Camera className={`w-6 h-6 mx-auto mb-2 ${
                      isInitialized 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-blue-600 dark:text-blue-400'
                    }`} />
                  )}
                  <p className="text-sm text-gray-600 dark:text-gray-400">دوربین</p>
                  <p className={`text-xs ${
                    mediaError 
                      ? 'text-red-600 dark:text-red-400' 
                      : isInitialized 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-blue-600 dark:text-blue-400'
                  }`}>
                    {mediaError ? 'خطا' : isInitialized ? 'آماده' : 'در حال تست...'}
                  </p>
                </div>
                <div className={`text-center p-3 rounded-lg ${
                  mediaError 
                    ? 'bg-red-50 dark:bg-red-900/20' 
                    : isInitialized 
                      ? 'bg-green-50 dark:bg-green-900/20' 
                      : 'bg-blue-50 dark:bg-blue-900/20'
                }`}>
                  {mediaError ? (
                    <MicOff className="w-6 h-6 text-red-600 dark:text-red-400 mx-auto mb-2" />
                  ) : (
                    <Mic className={`w-6 h-6 mx-auto mb-2 ${
                      isInitialized 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-blue-600 dark:text-blue-400'
                    }`} />
                  )}
                  <p className="text-sm text-gray-600 dark:text-gray-400">میکروفن</p>
                  <p className={`text-xs ${
                    mediaError 
                      ? 'text-red-600 dark:text-red-400' 
                      : isInitialized 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-blue-600 dark:text-blue-400'
                  }`}>
                    {mediaError ? 'خطا' : isInitialized ? 'آماده' : 'در حال تست...'}
                  </p>
                </div>
              </div>
              
              <div className="relative">
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-32 bg-gray-100 dark:bg-gray-700 rounded-lg object-cover"
                />
                {!isInitialized && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-lg">
                    <div className="text-center">
                      <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">در حال آماده‌سازی دوربین...</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* IP Address Warning */}
              {typeof window !== 'undefined' && window.location.hostname.match(/^\d+\.\d+\.\d+\.\d+$/) && window.location.hostname !== '127.0.0.1' && (
                <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <span className="text-sm font-medium text-red-700 dark:text-red-300">
                      آدرس اشتباه - دوربین کار نخواهد کرد!
                    </span>
                  </div>
                  <p className="text-xs text-red-600 dark:text-red-400 mb-3">
                    شما از IP استفاده می‌کنید. برای کار کردن دوربین باید از localhost استفاده کنید.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        const newUrl = `http://localhost:${window.location.port}${window.location.pathname}`;
                        window.location.href = newUrl;
                      }}
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      🚀 رفتن به localhost
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowPermissionGuide(true)}
                      className="text-red-600 border-red-300"
                    >
                      راهنمای حل مشکل
                    </Button>
                  </div>
                </div>
              )}

              {/* HTTPS Warning */}
              {typeof window !== 'undefined' && location.protocol !== 'https:' && location.hostname === 'localhost' && (
                <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                    <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                      localhost - دوربین باید کار کند
                    </span>
                  </div>
                  <p className="text-xs text-yellow-600 dark:text-yellow-400">
                    آدرس درست است. اگر دوربین کار نکرد، دکمه &quot;تست دوربین&quot; کلیک کنید.
                  </p>
                </div>
              )}

              {mediaError && (
                <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-2">
                    برای استفاده از تماس تصویری، لطفا:
                  </p>
                  <ul className="text-xs text-yellow-600 dark:text-yellow-400 space-y-1">
                    <li>• دسترسی دوربین و میکروفن را فعال کنید</li>
                    <li>• از مرورگر مدرن استفاده کنید</li>
                    <li>• اتصال HTTPS داشته باشید</li>
                  </ul>
                </div>
              )}
              
              <Button 
                onClick={startCall}
                disabled={!!mediaError}
                className="w-full h-12 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Video className="w-5 h-5 mr-2" />
                {isTeacher ? 'شروع کلاس' : 'پیوستن به کلاس'}
              </Button>
              
              <div className="flex justify-between items-center pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={retryMediaAccess}
                  className="text-sm"
                >
                  <Camera className="w-4 h-4 ml-1" />
                  تست دوربین
                </Button>
                
                <Button
                  variant="link"
                  onClick={() => setShowPermissionGuide(true)}
                  className="text-sm text-blue-600 dark:text-blue-400"
                >
                  راهنما
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (callState.isConnecting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-200 border-t-blue-500 mx-auto mb-6"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">در حال اتصال...</h3>
          <p className="text-gray-600 dark:text-gray-400">لطفا صبر کنید تا اتصال برقرار شود</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Main Video Area */}
      <div className="relative w-full h-screen">
        {/* Remote Video (Main) */}
        {(remoteVideoRef.current?.srcObject && !showFakeTeacher && callState.isConnected) ? (
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
            onLoadedMetadata={() => console.log('Remote video loaded')}
          />
        ) : (
          /* Fake Teacher Video - Demo */
          <div className="w-full h-full bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center relative overflow-hidden">
            {/* Video Noise Effect */}
            <div className="absolute inset-0 bg-black/20 animate-pulse"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
            
            {/* Fake Video Call Interface */}
            <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-white text-sm">LIVE</span>
              </div>
            </div>
            
            {/* Teacher Avatar */}
            <motion.div 
              className="relative z-10 text-center"
              animate={{ 
                y: [0, -5, 0],
                scale: [1, 1.02, 1]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <motion.div 
                className="w-40 h-40 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white/30 shadow-2xl"
                animate={{ 
                  boxShadow: [
                    "0 0 20px rgba(59, 130, 246, 0.3)",
                    "0 0 30px rgba(59, 130, 246, 0.6)",
                    "0 0 20px rgba(59, 130, 246, 0.3)"
                  ]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <svg className="w-20 h-20 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </motion.div>
              <h3 className="text-3xl font-bold text-white mb-2">{teacherName || 'معلم'}</h3>
              <p className="text-blue-200 mb-4 text-lg">معلم زبان انگلیسی</p>
              <div className="flex items-center justify-center gap-2 text-green-400 bg-black/30 rounded-full px-4 py-2">
                <motion.div 
                  className="w-3 h-3 bg-green-400 rounded-full"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span className="text-sm font-medium">در حال تدریس...</span>
              </div>
            </motion.div>
            
            {/* Interactive Teaching Elements */}
            <motion.div 
              className="absolute top-20 left-20 bg-yellow-400/20 backdrop-blur-sm rounded-lg px-3 py-2"
              animate={{ x: [0, 10, 0], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span className="text-white text-xs">Grammar Point</span>
              </div>
            </motion.div>
            
            <motion.div 
              className="absolute bottom-32 right-16 bg-green-400/20 backdrop-blur-sm rounded-lg px-3 py-2"
              animate={{ y: [0, -10, 0], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-white text-xs">Vocabulary</span>
              </div>
            </motion.div>
            
            {/* Floating Elements */}
            <motion.div 
              className="absolute top-1/4 right-20 w-4 h-4 bg-blue-400/50 rounded-full"
              animate={{ 
                y: [0, -20, 0],
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            
            <motion.div 
              className="absolute bottom-1/4 left-16 w-6 h-6 bg-purple-400/30 rounded-full"
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.2, 0.6, 0.2]
              }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
            />
            
            {/* Teaching Content Simulation */}
            <div className="absolute bottom-4 left-4 right-4">
              <motion.div 
                className="bg-black/40 backdrop-blur-sm rounded-lg p-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2 }}
              >
                <p className="text-white text-sm text-center">
                  &quot;Today we&apos;re learning about Present Perfect tense...&quot;
                </p>
              </motion.div>
            </div>
          </div>
        )}
        
        {/* Local Video (Picture in Picture) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-4 right-4 w-48 h-36 sm:w-64 sm:h-48 bg-gray-900 rounded-lg overflow-hidden border-2 border-white/20"
        >
          {callState.isVideoEnabled ? (
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
              onLoadedMetadata={() => console.log('Local video metadata loaded in call')}
              onPlay={() => console.log('Local video playing in call')}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-800">
              <div className="text-center">
                <CameraOff className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-xs sm:text-sm text-gray-300">دوربین خاموش</p>
              </div>
            </div>
          )}
          <div className="absolute top-2 left-2">
            <Badge className="bg-blue-500 text-white text-xs">شما</Badge>
          </div>
          {!callState.isAudioEnabled && (
            <div className="absolute bottom-2 left-2">
              <Badge className="bg-red-500 text-white flex items-center gap-1 text-xs">
                <MicOff className="w-3 h-3" />
                خاموش
              </Badge>
            </div>
          )}
        </motion.div>

        {/* Call Info Bar */}
        <div className="absolute top-4 left-4 flex items-center gap-4 z-40">
          <div className="bg-white/20 backdrop-blur-md rounded-xl px-4 py-2 text-white border border-white/20 shadow-lg">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${getConnectionQualityColor()}`}></div>
              <span className="text-sm font-semibold text-white">
                {formatDuration(callDuration)}
              </span>
            </div>
          </div>
          
          <div className="bg-white/20 backdrop-blur-md rounded-xl px-4 py-2 text-white border border-white/20 shadow-lg">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-white" />
              <span className="text-sm font-semibold text-white">
                {participants.length} شرکت‌کننده
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Control Bar - Top Left Vertical */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="absolute left-2 top-4 sm:hidden z-50"
        >
          <div className="bg-gradient-to-b from-black/80 to-black/60 backdrop-blur-xl rounded-3xl px-3 py-4 shadow-2xl border border-white/10">
            <div className="flex flex-col items-center gap-2">
              {/* Video Toggle */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={toggleVideo}
                      className={`w-10 h-10 rounded-2xl shadow-lg transition-all duration-300 hover:scale-110 ${
                        callState.isVideoEnabled
                          ? 'bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-green-500/25'
                          : 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-red-500/25'
                      }`}
                    >
                      {callState.isVideoEnabled ? (
                        <Video className="w-4 h-4 text-white" />
                      ) : (
                        <VideoOff className="w-4 h-4 text-white" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="font-medium">
                    {callState.isVideoEnabled ? 'خاموش کردن دوربین' : 'روشن کردن دوربین'}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Audio Toggle */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={toggleAudio}
                      className={`w-10 h-10 rounded-2xl shadow-lg transition-all duration-300 hover:scale-110 ${
                        callState.isAudioEnabled
                          ? 'bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-blue-500/25'
                          : 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-red-500/25'
                      }`}
                    >
                      {callState.isAudioEnabled ? (
                        <Mic className="w-4 h-4 text-white" />
                      ) : (
                        <MicOff className="w-4 h-4 text-white" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="font-medium">
                    {callState.isAudioEnabled ? 'خاموش کردن میکروفن' : 'روشن کردن میکروفن'}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Chat Toggle */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowChat(!showChat)}
                      className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-lg shadow-purple-500/25 transition-all duration-300 hover:scale-110 relative"
                    >
                      <MessageSquare className="w-4 h-4 text-white" />
                      {chatMessages.length > 0 && (
                        <Badge className="absolute -top-1 -right-1 min-w-4 h-4 text-xs bg-red-500 border border-red-600 animate-pulse">
                          {chatMessages.length}
                        </Badge>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="font-medium">
                    چت
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Whiteboard Toggle */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowWhiteboard(!showWhiteboard)}
                      className={`w-10 h-10 rounded-2xl shadow-lg transition-all duration-300 hover:scale-110 ${
                        showWhiteboard
                          ? 'bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-orange-500/25'
                          : 'bg-gradient-to-br from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 shadow-gray-500/25'
                      }`}
                    >
                      <PenTool className="w-4 h-4 text-white" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="font-medium">
                    {showWhiteboard ? 'بستن تخته سفید' : 'باز کردن تخته سفید'}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Screen Share */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={toggleScreenShare}
                      className={`w-10 h-10 rounded-2xl shadow-lg transition-all duration-300 hover:scale-110 ${
                        callState.isScreenSharing
                          ? 'bg-gradient-to-br from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 shadow-yellow-500/25'
                          : 'bg-gradient-to-br from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 shadow-gray-500/25'
                      }`}
                    >
                      <Monitor className="w-4 h-4 text-white" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="font-medium">
                    {callState.isScreenSharing ? 'توقف اشتراک‌گذاری' : 'اشتراک‌گذاری صفحه'}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Settings */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        // Settings functionality can be added here
                        console.log('Settings clicked');
                      }}
                      className="w-10 h-10 rounded-2xl bg-gradient-to-br from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 shadow-lg shadow-gray-500/25 transition-all duration-300 hover:scale-110"
                    >
                      <Settings className="w-4 h-4 text-white" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="font-medium">
                    تنظیمات
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Toggle Fake Teacher */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowFakeTeacher(!showFakeTeacher)}
                      className={`w-10 h-10 rounded-2xl shadow-lg transition-all duration-300 hover:scale-110 ${
                        showFakeTeacher
                          ? 'bg-gradient-to-br from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 shadow-pink-500/25'
                          : 'bg-gradient-to-br from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 shadow-gray-500/25'
                      }`}
                    >
                      <UserCheck className="w-4 h-4 text-white" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="font-medium">
                    {showFakeTeacher ? 'غیرفعال کردن معلم مجازی' : 'فعال کردن معلم مجازی'}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Fix Camera */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={async () => {
                        try {
                          console.log('Fixing camera in call...');
                          const stream = await navigator.mediaDevices.getUserMedia({
                            video: true,
                            audio: callState.isAudioEnabled
                          });
                          
                          if (localVideoRef.current) {
                            localVideoRef.current.srcObject = stream;
                            await localVideoRef.current.play();
                            setCallState(prev => ({ ...prev, isVideoEnabled: true }));
                            console.log('Camera fixed successfully');
                          }
                        } catch (error) {
                          console.error('Failed to fix camera:', error);
                        }
                      }}
                      className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 shadow-lg shadow-teal-500/25 transition-all duration-300 hover:scale-110"
                    >
                      <Camera className="w-4 h-4 text-white" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="font-medium">
                    رفع مشکل دوربین
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* End Call */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={endCall}
                      className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/25 transition-all duration-300 hover:scale-110"
                    >
                      <PhoneOff className="w-4 h-4 text-white" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="font-medium">
                    پایان تماس
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </motion.div>

        {/* Control Bar - Desktop - Top Left */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="absolute left-4 top-4 z-50 hidden sm:block"
        >
          <TooltipProvider>
            <div className="bg-gradient-to-b from-black/80 to-black/60 backdrop-blur-xl rounded-3xl px-3 py-4 shadow-2xl border border-white/10">
              <div className="flex flex-col items-center gap-3">
                {/* Video Toggle */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={callState.isVideoEnabled ? "default" : "destructive"}
                      size="sm"
                      onClick={toggleVideo}
                      className={`rounded-2xl w-12 h-12 shadow-lg transition-all duration-300 hover:scale-110 ${
                        callState.isVideoEnabled 
                          ? 'bg-gradient-to-br from-blue-400/90 to-blue-600/90 hover:from-blue-500 hover:to-blue-700 shadow-blue-500/25 backdrop-blur-sm' 
                          : 'bg-gradient-to-br from-red-400/90 to-red-600/90 hover:from-red-500 hover:to-red-700 shadow-red-500/25 backdrop-blur-sm'
                      }`}
                    >
                      {callState.isVideoEnabled ? (
                        <Video className="w-5 h-5" />
                      ) : (
                        <VideoOff className="w-5 h-5" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p className="font-medium">{callState.isVideoEnabled ? 'خاموش کردن دوربین' : 'روشن کردن دوربین'}</p>
                  </TooltipContent>
                </Tooltip>

                {/* Audio Toggle */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={callState.isAudioEnabled ? "default" : "destructive"}
                      size="sm"
                      onClick={toggleAudio}
                      className={`rounded-2xl w-12 h-12 shadow-lg transition-all duration-300 hover:scale-110 ${
                        callState.isAudioEnabled 
                          ? 'bg-gradient-to-br from-green-400/90 to-green-600/90 hover:from-green-500 hover:to-green-700 shadow-green-500/25 backdrop-blur-sm' 
                          : 'bg-gradient-to-br from-red-400/90 to-red-600/90 hover:from-red-500 hover:to-red-700 shadow-red-500/25 backdrop-blur-sm'
                      }`}
                    >
                      {callState.isAudioEnabled ? (
                        <Mic className="w-5 h-5" />
                      ) : (
                        <MicOff className="w-5 h-5" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p className="font-medium">{callState.isAudioEnabled ? 'خاموش کردن میکروفن' : 'روشن کردن میکروفن'}</p>
                  </TooltipContent>
                </Tooltip>

                {/* Screen Share */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={callState.isScreenSharing ? "secondary" : "outline"}
                      size="sm"
                      onClick={toggleScreenShare}
                      className={`rounded-2xl w-12 h-12 shadow-lg transition-all duration-300 hover:scale-110 ${
                        callState.isScreenSharing 
                          ? 'bg-gradient-to-br from-purple-400/90 to-purple-600/90 hover:from-purple-500 hover:to-purple-700 shadow-purple-500/25 backdrop-blur-sm border-0' 
                          : 'bg-white/10 hover:bg-white/20 border-white/20 backdrop-blur-sm'
                      }`}
                    >
                      {callState.isScreenSharing ? (
                        <MonitorOff className="w-5 h-5" />
                      ) : (
                        <Monitor className="w-5 h-5" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p className="font-medium">{callState.isScreenSharing ? 'توقف اشتراک صفحه' : 'اشتراک صفحه'}</p>
                  </TooltipContent>
                </Tooltip>

                {/* Chat Toggle */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={showChat ? "secondary" : "outline"}
                      size="sm"
                      onClick={() => setShowChat(!showChat)}
                      className={`rounded-2xl w-12 h-12 shadow-lg transition-all duration-300 hover:scale-110 relative ${
                        showChat 
                          ? 'bg-gradient-to-br from-indigo-400/90 to-indigo-600/90 hover:from-indigo-500 hover:to-indigo-700 shadow-indigo-500/25 backdrop-blur-sm border-0' 
                          : 'bg-white/10 hover:bg-white/20 border-white/20 backdrop-blur-sm'
                      }`}
                    >
                      <MessageCircle className="w-5 h-5" />
                      {chatMessages.length > 0 && (
                        <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-5 h-5 flex items-center justify-center rounded-full border-2 border-black/80 shadow-lg animate-pulse">
                          {chatMessages.length}
                        </Badge>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p className="font-medium">{showChat ? 'بستن چت' : 'باز کردن چت'}</p>
                  </TooltipContent>
                </Tooltip>

                {/* Whiteboard Toggle */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={showWhiteboard ? "secondary" : "outline"}
                      size="sm"
                      onClick={() => setShowWhiteboard(!showWhiteboard)}
                      className={`rounded-2xl w-12 h-12 shadow-lg transition-all duration-300 hover:scale-110 ${
                        showWhiteboard 
                          ? 'bg-gradient-to-br from-emerald-400/90 to-emerald-600/90 hover:from-emerald-500 hover:to-emerald-700 shadow-emerald-500/25 backdrop-blur-sm border-0' 
                          : 'bg-white/10 hover:bg-white/20 border-white/20 backdrop-blur-sm'
                      }`}
                    >
                      <Palette className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p className="font-medium">{showWhiteboard ? 'بستن وایت‌بورد' : 'باز کردن وایت‌بورد'}</p>
                  </TooltipContent>
                </Tooltip>

                {/* Settings */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-2xl w-12 h-12 shadow-lg transition-all duration-300 hover:scale-110 bg-white/10 hover:bg-white/20 border-white/20 backdrop-blur-sm"
                    >
                      <Settings className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p className="font-medium">تنظیمات</p>
                  </TooltipContent>
                </Tooltip>

                {/* Toggle Fake Teacher */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={showFakeTeacher ? "default" : "outline"}
                      size="sm"
                      onClick={() => setShowFakeTeacher(!showFakeTeacher)}
                      className={`rounded-2xl w-12 h-12 shadow-lg transition-all duration-300 hover:scale-110 ${
                        showFakeTeacher 
                          ? 'bg-gradient-to-br from-amber-400/90 to-amber-600/90 hover:from-amber-500 hover:to-amber-700 shadow-amber-500/25 backdrop-blur-sm' 
                          : 'bg-white/10 hover:bg-white/20 border-white/20 backdrop-blur-sm'
                      }`}
                    >
                      {showFakeTeacher ? (
                        <Monitor className="w-5 h-5" />
                      ) : (
                        <Monitor className="w-5 h-5" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p className="font-medium">{showFakeTeacher ? 'تصویر واقعی معلم' : 'معلم دمو'}</p>
                  </TooltipContent>
                </Tooltip>

                {/* Fix Camera Button - Debug */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        try {
                          console.log('Fixing camera in call...');
                          const stream = await navigator.mediaDevices.getUserMedia({
                            video: true,
                            audio: callState.isAudioEnabled
                          });
                          
                          if (localVideoRef.current) {
                            localVideoRef.current.srcObject = stream;
                            await localVideoRef.current.play();
                            setCallState(prev => ({ ...prev, isVideoEnabled: true }));
                            console.log('Camera fixed successfully');
                          }
                        } catch (error) {
                          console.error('Failed to fix camera:', error);
                        }
                      }}
                      className="rounded-2xl w-12 h-12 shadow-lg transition-all duration-300 hover:scale-110 bg-white/10 hover:bg-white/20 border-white/20 backdrop-blur-sm"
                    >
                      <Camera className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p className="font-medium">تست دوربین</p>
                  </TooltipContent>
                </Tooltip>

                {/* End Call */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={endCall}
                      className="rounded-2xl w-12 h-12 shadow-lg transition-all duration-300 hover:scale-110 bg-gradient-to-br from-red-400/90 to-red-600/90 hover:from-red-500 hover:to-red-700 shadow-red-500/25 backdrop-blur-sm"
                    >
                      <PhoneOff className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p className="font-medium">پایان تماس</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </TooltipProvider>
        </motion.div>

        {/* Chat Panel - Enhanced */}
        <AnimatePresence>
          {showChat && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 flex items-center justify-center z-50"
            >
              <div className="bg-black/50 backdrop-blur-sm absolute inset-0" onClick={() => setShowChat(false)}></div>
              <div className="relative w-full max-w-md mx-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-bold text-lg">چت</h3>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowChat(false)}
                      className="text-white/70 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="h-64 overflow-y-auto space-y-3 mb-4">
                    {chatMessages.map((message, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs px-3 py-2 rounded-2xl ${
                          message.sender === 'user' 
                            ? 'bg-blue-500/80 text-white' 
                            : 'bg-white/20 text-white'
                        }`}>
                          <p className="text-sm">{message.message}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Input
                      placeholder="پیام خود را بنویسید..."
                      className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          // Handle send message
                        }
                      }}
                    />
                    <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Whiteboard Panel - Enhanced */}
        <AnimatePresence>
          {showWhiteboard && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 flex items-center justify-center z-50"
            >
              <div className="bg-black/50 backdrop-blur-sm absolute inset-0" onClick={() => setShowWhiteboard(false)}></div>
              <div className="relative w-full max-w-4xl mx-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-bold text-lg">تخته سفید</h3>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setDrawingTool('pen')}
                        className={`${drawingTool === 'pen' ? 'bg-blue-500/80 text-white' : 'bg-gray-700/80 text-gray-300'} hover:bg-blue-600/80`}
                      >
                        <PenTool className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setDrawingTool('eraser')}
                        className={`${drawingTool === 'eraser' ? 'bg-red-500/80 text-white' : 'bg-gray-700/80 text-gray-300'} hover:bg-red-600/80`}
                      >
                        <Eraser className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={undo}
                        disabled={historyIndex <= 0}
                        className="bg-gray-700/80 text-gray-300 hover:bg-gray-600/80 disabled:opacity-50"
                      >
                        <Undo className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={redo}
                        disabled={historyIndex >= drawingHistory.length - 1}
                        className="bg-gray-700/80 text-gray-300 hover:bg-gray-600/80 disabled:opacity-50"
                      >
                        <Redo className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setShowWhiteboard(false)}
                        className="bg-red-500/80 text-white hover:bg-red-600/80"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mb-4 flex-wrap">
                    {[
                      { color: '#FF0000', name: 'قرمز' },
                      { color: '#00FF00', name: 'سبز' },
                      { color: '#0000FF', name: 'آبی' },
                      { color: '#FFFF00', name: 'زرد' },
                      { color: '#FF00FF', name: 'صورتی' },
                      { color: '#00FFFF', name: 'فیروزه‌ای' },
                      { color: '#FFFFFF', name: 'سفید' },
                      { color: '#000000', name: 'سیاه' }
                    ].map(({ color, name }) => (
                      <button
                        key={color}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          drawingColor === color 
                            ? 'border-white scale-110 shadow-lg' 
                            : 'border-gray-400 hover:scale-105'
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setDrawingColor(color)}
                        title={name}
                      />
                    ))}
                  </div>
                  
                  <canvas
                    ref={canvasRef}
                    className="w-full h-64 sm:h-80 bg-white/10 rounded-xl border border-white/20 cursor-crosshair touch-none"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Mouse down on canvas');
                      startDrawing(e);
                    }}
                    onMouseUp={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Mouse up on canvas');
                      stopDrawing();
                    }}
                    onMouseMove={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (isDrawing) {
                        console.log('Mouse move while drawing');
                        draw(e);
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Mouse leave canvas');
                      stopDrawing();
                    }}
                    onTouchStart={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Touch start on canvas');
                      startDrawing(e);
                    }}
                    onTouchEnd={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Touch end on canvas');
                      stopDrawing();
                    }}
                    onTouchMove={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (isDrawing) {
                        console.log('Touch move while drawing');
                        draw(e);
                      }
                    }}
                    style={{ touchAction: 'none' }}
                  />
                  
                  <div className="flex gap-2 mt-4">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => {
                        console.log('Test button clicked');
                        if (contextRef.current && canvasRef.current) {
                          // Test drawing
                          const ctx = contextRef.current;
                          const canvas = canvasRef.current;
                          
                          console.log('Canvas size:', canvas.width, 'x', canvas.height);
                          console.log('Context available:', !!ctx);
                          
                          ctx.strokeStyle = '#FF0000';
                          ctx.lineWidth = 5;
                          ctx.lineCap = 'round';
                          ctx.lineJoin = 'round';
                          ctx.globalCompositeOperation = 'source-over';
                          
                          ctx.beginPath();
                          ctx.moveTo(10, 10);
                          ctx.lineTo(100, 100);
                          ctx.stroke();
                          
                          console.log('Test line drawn');
                        } else {
                          console.log('Canvas or context not available');
                        }
                      }}
                      className="text-white border-white/30 hover:bg-red-500/20"
                    >
                      تست رسم
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => {
                        console.log('Clear button clicked');
                        clearCanvas();
                      }}
                      className="text-white border-white/30 hover:bg-red-500/20"
                    >
                      پاک کردن
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => {
                        console.log('Download button clicked');
                        downloadCanvas();
                      }}
                      className="text-white border-white/30 hover:bg-blue-500/20"
                    >
                      ذخیره
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Camera Permission Guide */}
        <CameraPermissionGuide
          isVisible={showPermissionGuide}
          onClose={() => setShowPermissionGuide(false)}
          onRetry={retryMediaAccess}
        />
      </div>
    </div>
  );
}
