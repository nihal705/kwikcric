import { useCallback, useRef } from "react";

export const useWebSocket = () => {
  const socketRef = useRef<WebSocket | null>(null);

  const connect = useCallback(() => {
    const wsUrl = import.meta.env.VITE_WS_URL || "ws://localhost:5000";
    socketRef.current = new WebSocket(wsUrl);

    socketRef.current.onopen = () => {};

    socketRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socketRef.current.onclose = () => {};
  }, []);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
  }, []);

  const sendMessage = useCallback((message: any) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
    }
  }, []);

  return { connect, disconnect, sendMessage };
};
