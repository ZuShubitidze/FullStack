import type { markAsReadInput } from "src/validators/notificationsValidators.js";
import prisma from "@lib/prisma";
import type { Request, Response } from "express";

const getNotifications = async (req: Request, res: Response) => {
  const notifications = await prisma.notification.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: "desc" },
    take: 20, // Limit
  });
  res.status(200).json(notifications);
};

const markAllAsRead = async (req: Request, res: Response) => {
  const result = await prisma.notification.updateMany({
    where: { userId: req.user.id, isRead: false },
    data: { isRead: true },
  });
  res.status(200).json({ success: true, count: result.count });
};

const markAsRead = async (req: Request, res: Response) => {
  const { notificationId }: markAsReadInput = req.body;

  await prisma.notification.update({
    where: { userId: req.user.id, isRead: false, id: notificationId },
    data: { isRead: true },
  });
  res.status(200).json({ success: true });
};

export { getNotifications, markAllAsRead, markAsRead };
