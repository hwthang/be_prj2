import { buildResponse } from "../../../utils/response.helper";
import notificationService from "../service/notification.service.js";

class NotificationController {
  createNotification = async (req, res) => {
    try {
      const input = {
        accountId: req.body?.accountId,
        title: req.body?.title,
        content: req.body?.content,
        type: req.body?.type,
        scheduledAt: req.body?.scheduledAt
      };

      let result;
      if (input.scheduledAt) {
        result = await notificationService.scheduleNotification(input);
      } else {
        result = await notificationService.createNotification(input);
      }

      if (typeof result === "string") {
        res.json(buildResponse(result, false));
        return;
      }

      res.json(buildResponse("Tạo thông báo thành công", true, {
        notification: result
      }));
    } catch (error) {
      console.log(error);
      res.json(buildResponse("Lỗi khi tạo thông báo", false));
    }
  };

  markAsSeen = async (req, res) => {
    try {
      const input = {
        accountId: req.body?.accountId,
        notificationId: req.body?.notificationId
      };

      const result = await notificationService.markNotificationAsSeen(input);
      if (typeof result === "string") {
        res.json(buildResponse(result, false));
        return;
      }

      res.json(buildResponse("Đánh dấu thông báo đã xem thành công", true, {
        seen: result
      }));
    } catch (error) {
      console.log(error);
      res.json(buildResponse("Lỗi khi đánh dấu thông báo đã xem", false));
    }
  };

  getNotifications = async (req, res) => {
    try {
      const accountId = req.params?.accountId;
      const result = await notificationService.getUserNotifications(accountId);
      if (typeof result === "string") {
        res.json(buildResponse(result, false));
        return;
      }

      res.json(buildResponse("Lấy thông báo thành công", true, {
        notifications: result
      }));
    } catch (error) {
      console.log(error);
      res.json(buildResponse("Lỗi khi lấy thông báo", false));
    }
  };

  getUnseenCount = async (req, res) => {
    try {
      const accountId = req.params?.accountId;
      const result = await notificationService.getUnseenNotificationsCount(accountId);
      if (typeof result === "string") {
        res.json(buildResponse(result, false));
        return;
      }

      res.json(buildResponse("Lấy số thông báo chưa xem thành công", true, {
        unseenCount: result
      }));
    } catch (error) {
      console.log(error);
      res.json(buildResponse("Lỗi khi lấy số thông báo chưa xem", false));
    }
  };
}

export default new NotificationController();