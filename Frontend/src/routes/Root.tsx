import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useSocket } from "@/context/SocketContext";
import { useEffect } from "react";
import { Outlet } from "react-router";
import { toast } from "sonner";

const Root = () => {
  // Socket
  const socket = useSocket();
  useEffect(() => {
    if (!socket) return;

    socket.on("new_notification", (data) => {
      console.log("NOTIFICATION RECEIVED:", data);
      toast.info(data.message);
    });

    return () => {
      socket.off("new_notification");
    };
  }, [socket]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1 md:mx-25 mx-6 pb-10">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Root;
