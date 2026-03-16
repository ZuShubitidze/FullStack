import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./Authcontext";

const SocketContext = createContext<Socket | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);

  // Initialize the connection once
  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_API_URL, {
      withCredentials: true,
      autoConnect: true,
      transports: ["websocket"],
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  // Join the room whenever the socket is ready OR the user changes
  useEffect(() => {
    if (socket && user?.id) {
      console.log("Joining room for user:", user.id);
      socket.emit("join_user_room", user.id);
    }
  }, [socket, user]); // Depend on the local 'socket' state

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
