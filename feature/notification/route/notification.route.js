import express from "express";
import notificationController from "../controller/notification.controller.js";

const NotificationRoute = express.Router();

NotificationRoute.post("/", notificationController.createNotification);
NotificationRoute.post("/seen", notificationController.markAsSeen);
NotificationRoute.get("/user/:accountId", notificationController.getNotifications);
NotificationRoute.get("/unseen/:accountId", notificationController.getUnseenCount);

export default NotificationRoute;