import { prisma } from "../lib/prisma.js";
import type { Request, Response } from "express";

const getNotifications = async (req: Request, res: Response) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
      take: 20, // Limit
    });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(404).json({ message: "Couldn't fetch notifications" });
  }
};

const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const result = await prisma.notification.updateMany({
      where: { userId: req.user.id, isRead: false },
      data: { isRead: true },
    });
    res.status(200).json({ success: true, count: result.count });
  } catch (error: any) {
    res.status(404).json({ message: "Failed to mark all as read" });
    console.log(error.message);
  }
};

const markAsRead = async (req: Request, res: Response) => {
  const { notificationId } = req.body;

  try {
    const result = await prisma.notification.update({
      where: { userId: req.user.id, isRead: false, id: notificationId },
      data: { isRead: true },
    });
    res.status(200).json({ success: true });
  } catch (error: any) {
    res.status(404).json({ message: "Failed to mark as read" });
    console.log(error.message);
  }
};

export { getNotifications, markAllAsRead, markAsRead };
