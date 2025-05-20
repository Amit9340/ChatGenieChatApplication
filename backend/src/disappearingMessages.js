// backend/disappearingMessages.js
import mongoose from "mongoose";
import Message from "./models/messageModel.js";

export default (io) => {
  // Delete expired messages every 30 seconds
  setInterval(async () => {
    const now = new Date();
    console.log(`[CRON] Checking for expired messages at ${now.toISOString()}`);
    const expiredMessages = await Message.find({ expiresAt: { $lte: now } });
    console.log(`[CRON] Found ${expiredMessages.length} expired messages`);

    for (const msg of expiredMessages) {
      if (!msg || !msg._id || !msg.conversation) {
        console.error("⚠️ Skipping invalid or incomplete message:", msg);
        continue;
      }
      console.log("Deleting message:", msg._id.toString(), msg.message ?? "(no message text)");
      // io.to(msg.conversation.toString()).emit("deleteMessage", msg._id);
      try {
        io.to(msg.conversation.toString()).emit("deleteMessage", msg._id);
        await Message.findByIdAndDelete(msg._id);
      } catch (err) {
        console.error("❌ Error deleting message:", err.message);
      }
      await Message.findByIdAndDelete(msg._id);
    }
  }, 1000); // ⏲️ Check every 30 seconds

  io.on("connection", (socket) => {
    socket.on("joinRoom", (conversationId) => {
      socket.join(conversationId);
    });

    socket.on("sendMessage", async ({ sender, receiver, content, expiresAt, scheduledAt }) => {
      console.log("📩 Message data received:", {
        sender,
        receiver,
        content,
        expiresAt,
        scheduledAt,
      });

      const message = new Message({
        sender,
        conversation: receiver,
        message: content,
        ...(expiresAt ? { expiresAt: new Date(expiresAt) } : {}),
        ...(scheduledAt ? { scheduledAt: new Date(scheduledAt), sent: false } : { sent: true }),
      });

      await message.save();
      if (!scheduledAt) {
        io.to(receiver).emit("newMessage", message);
        console.log("✅ Message sent instantly");
      } else {
        console.log("🕒 Message scheduled for later:", scheduledAt);
      }
    });
  });
};

