import { useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuthStore } from '../store/authStore';

let socket = null;

export const getSocket = () => socket;

export const useSocket = () => {
  const { user, token } = useAuthStore();
  const initialized = useRef(false);

  useEffect(() => {
    if (!token || initialized.current) return;

    socket = io('/', {
      auth: { token },
      reconnectionAttempts: 5,
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      console.log('🔌 Socket connected:', socket.id);
      if (user?._id) socket.emit('user:online', user._id);
    });

    socket.on('connect_error', (err) => console.warn('Socket error:', err.message));

    initialized.current = true;

    return () => {
      socket?.disconnect();
      socket = null;
      initialized.current = false;
    };
  }, [token, user]);

  const joinConversation = useCallback((convId) => {
    socket?.emit('conversation:join', convId);
  }, []);

  const sendSocketMessage = useCallback((data) => {
    socket?.emit('message:send', data);
  }, []);

  const onMessage = useCallback((handler) => {
    socket?.on('message:receive', handler);
    return () => socket?.off('message:receive', handler);
  }, []);

  const onTypingStart = useCallback((handler) => {
    socket?.on('typing:start', handler);
    return () => socket?.off('typing:start', handler);
  }, []);

  const emitTyping = useCallback((convId, start) => {
    const event = start ? 'typing:start' : 'typing:stop';
    socket?.emit(event, { conversationId: convId, userId: user?._id });
  }, [user]);

  return { socket, joinConversation, sendSocketMessage, onMessage, onTypingStart, emitTyping };
};
