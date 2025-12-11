import Seen from "../../seen/model/seen.model.js";
import Notification from "../model/notification.model.js";

class NotificationService {
  createNotification = async (input, io = null) => {
    try {
      const notificationData = {
        accountId: input.accountId,
        title: input.title,
        content: input.content,
        type: input.type || "info",
        isScheduled: input.scheduledAt ? true : false,
        scheduledAt: input.scheduledAt,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const newNotification = new Notification(notificationData);
      await newNotification.save();

      // Nếu không phải scheduled, gửi realtime ngay
      if (!input.scheduledAt && io && input.accountId) {
        io.to(input.accountId.toString()).emit("new_notification", {
          notification: newNotification
        });
      }

      return newNotification;
    } catch (error) {
      console.log(error);
      return "Lỗi khi tạo thông báo";
    }
  };

  scheduleNotification = async (input) => {
    try {
      const notification = await this.createNotification(input);
      
      if (input.scheduledAt) {
        const delay = new Date(input.scheduledAt) - new Date();
        
        if (delay > 0) {
          setTimeout(async () => {
            // Gửi realtime khi đến giờ scheduled
            // Cần import io ở đây hoặc sử dụng global event emitter
            console.log(`Gửi thông báo scheduled: ${notification.title}`);
            // Gửi realtime logic ở đây
          }, delay);
        }
      }
      
      return notification;
    } catch (error) {
      console.log(error);
      return "Lỗi khi lập lịch thông báo";
    }
  };

  markNotificationAsSeen = async (input, io = null) => {
    try {
      const result = await Seen.findOneAndUpdate(
        {
          accountId: input.accountId,
          targetId: input.notificationId,
          type: "notification"
        },
        {
          isSeen: true,
          updatedAt: new Date()
        },
        { upsert: true, new: true }
      );

      if (io) {
        io.to(input.accountId.toString()).emit("notification_seen", {
          notificationId: input.notificationId,
          seenAt: new Date()
        });
      }

      return result;
    } catch (error) {
      console.log(error);
      return "Lỗi khi đánh dấu thông báo đã xem";
    }
  };

  getUserNotifications = async (accountId) => {
    try {
      const notifications = await Notification.find({ accountId })
        .sort({ createdAt: -1 });

      const notificationsWithSeen = await Promise.all(
        notifications.map(async (notification) => {
          const seenRecord = await Seen.findOne({
            accountId: accountId,
            targetId: notification._id,
            type: "notification"
          });

          return {
            ...notification.toObject(),
            isSeen: seenRecord?.isSeen || false
          };
        })
      );

      return notificationsWithSeen;
    } catch (error) {
      console.log(error);
      return "Lỗi khi lấy thông báo";
    }
  };

  getUnseenNotificationsCount = async (accountId) => {
    try {
      const notifications = await Notification.find({ accountId });
      const notificationIds = notifications.map(n => n._id);

      const seenNotifications = await Seen.find({
        accountId: accountId,
        targetId: { $in: notificationIds },
        type: "notification",
        isSeen: true
      });

      return notifications.length - seenNotifications.length;
    } catch (error) {
      console.log(error);
      return "Lỗi khi đếm thông báo chưa xem";
    }
  };
}

export default new NotificationService();