import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api";
import { useAuth } from "@/context/Authcontext";
import { useEffect } from "react";
import { useSocket } from "@/context/SocketContext";
import type { Notification } from "@/types/notification.interface";

export const useNotifications = () => {
  const { user } = useAuth();
  const socket = useSocket();
  const queryClient = useQueryClient();

  // 1. Fetch notifications
  const { data: notifications = [], refetch } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const { data } = await api.get("/notifications");
      return data as Notification[];
    },
    enabled: !!user,
  });

  // 2. Real-time update: Refetch when a socket event arrives
  useEffect(() => {
    if (socket) {
      socket.on("new_notification", () => {
        refetch(); // Sync with DB
      });
      return () => {
        socket.off("new_notification");
      };
    }
  }, [socket, refetch]);

  // 3. Mutation to mark all as read
  const { mutate: markAllAsRead } = useMutation({
    mutationFn: () => api.put("/notifications/mark-all-read"),
    onSuccess: () => {
      // Optimistically update local cache
      queryClient.setQueryData(["notifications"], (old: any) =>
        old?.map((n: any) => ({ ...n, isRead: true })),
      );
    },
  });

  const { mutate: markAsRead } = useMutation({
    mutationFn: (notificationId: number) =>
      api.put("/notifications/mark-as-read", { notificationId }),
    onSuccess: () => {
      // Optimistically update local cache
      queryClient.setQueryData(["notifications"], (old: any) =>
        old?.map((n: any) => ({ ...n, isRead: true })),
      );
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const unreadCount = notifications.filter((n: any) => !n.isRead).length;

  return { notifications, unreadCount, markAllAsRead, markAsRead };
};
