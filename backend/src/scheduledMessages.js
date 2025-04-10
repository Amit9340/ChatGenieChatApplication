import mongoose from "mongoose";
import Message from "./models/messageModel.js";

export const scheduleMessagesCron = (io) => {
  setInterval(async () => {
    console.log("⏰ Scheduler Running...");
    const now = new Date();
    const dueMessages = await Message.find({
      scheduledAt: { $lte: now },
      sent: false,
    });

    // 🔽 Yaha ye if block add karo
    if (dueMessages.length > 0) {
      console.log("📤 Messages to send now:", dueMessages.length);
    }

    for (const msg of dueMessages) {
      // Use the same now for comparison
      const timeDiff = new Date(msg.scheduledAt) - now;
      // Allow a margin of 1 second to prevent microsecond error
      if (timeDiff > 1000) {
        console.log(
          "⛔ Skipping message scheduled in the future:",
          msg._id,
          "in",
          timeDiff,
          "ms"
        );
        continue;
      }
      // const now = new Date();
      // ⛔ Prevent sending if time is invalid (somehow scheduledAt is in the past but sent = false)
      if (msg.scheduledAt && new Date(msg.scheduledAt) > now) {
        console.log("⛔ Skipping message scheduled in the future:", msg._id);
        continue;
      }

      console.log("📤 Sending scheduled message ID:", msg._id);
      // io.to(msg.conversation.toString()).emit("newMessage", msg);
      io.to(msg.conversation.toString()).emit("newMessage", {
        ...msg.toObject(),
        sent: true,
      });
      msg.sent = true;
      await msg.save();
    }
  }, 30 * 1000); // every 30 seconds
};
