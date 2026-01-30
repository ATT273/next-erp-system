"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./authProvider";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { authSession, setAuthSession } = useAuth();
  useEffect(() => {
    // Tạo socket connection
    const socketInstance = io("http://localhost:5000", {
      transports: ["websocket", "polling"],
    });

    socketInstance.on("connect", () => {
      console.log("✅ Connected to Socket.IO server");
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      console.log("❌ Disconnected from Socket.IO server");
      setIsConnected(false);
    });

    setSocket(socketInstance);

    // Cleanup khi component unmount
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket || !isConnected) return;

    // ✅ Listen event role_updated
    socket.on("role_updated", (data) => {
      const newPermissions = data.role.permissions;
      if (authSession && authSession.roleCode === data.role.code) {
        setAuthSession((prev) => ({ ...prev, permissions: newPermissions }));
      }
    });

    // Cleanup
    return () => {
      socket.off("role_updated");
    };
  }, [socket, isConnected]);
  return <SocketContext.Provider value={{ socket, isConnected }}>{children}</SocketContext.Provider>;
};

const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

export { SocketProvider, useSocket };
