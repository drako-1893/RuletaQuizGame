import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || (import.meta.env.DEV ? 'http://localhost:3000' : '');

export function useSocket(roomId, playerName) {
  const [roomData, setRoomData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [spinEvent, setSpinEvent] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(SOCKET_URL);

    socketRef.current.on('connect', () => {
      setIsConnected(true);
      if (roomId && playerName) {
        socketRef.current.emit('join_room', { roomId, playerName });
      }
    });

    socketRef.current.on('disconnect', () => {
      setIsConnected(false);
    });

    socketRef.current.on('room_updated', (data) => {
      setRoomData(data);
    });

    socketRef.current.on('roulette_spun', (data) => {
      setSpinEvent(data); // Trigger spin animation
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [roomId, playerName]);

  const spinRoulette = () => {
    if (socketRef.current && roomId) {
      socketRef.current.emit('spin_roulette', { roomId });
    }
  };

  const nextTurn = () => {
    if (socketRef.current && roomId) {
      socketRef.current.emit('next_turn', { roomId });
    }
  };

  const updateQuestions = (questions) => {
    if (socketRef.current && roomId) {
      socketRef.current.emit('update_questions', { roomId, questions });
    }
  };

  const sendMessage = (message) => {
    if (socketRef.current && roomId && playerName) {
      socketRef.current.emit('send_message', { roomId, message, playerName });
    }
  };

  const deleteQuestion = (question) => {
    if (socketRef.current && roomId) {
      socketRef.current.emit('delete_question', { roomId, question });
    }
  };

  return {
    socketId: socketRef.current?.id,
    isConnected,
    roomData,
    spinEvent,
    spinRoulette,
    nextTurn,
    updateQuestions,
    deleteQuestion,
    sendMessage
  };
}
