//backend>src>scheduledMessage.js
import mongoose from "mongoose";
import Message from "./models/messageModel.js";

export const scheduleMessagesCron = (io) => {
  setInterval(async () => {
    console.log("⏰ Scheduler Running...");

    const now = new Date();

    // ✅ Get all messages that are due and not yet sent
    const dueMessages = await Message.find({
      scheduledAt: { $lte: now },
      sent: false,
    });

    if (dueMessages.length > 0) {
      console.log("📤 Messages to send now:", dueMessages.length);
    }

    for (const msg of dueMessages) {
      const timeDiff = new Date(msg.scheduledAt) - now;

      // ✅ Allow 1 second margin for micro-differences
      if (timeDiff > 1000) {
        console.log("⏳ Skipping future message:", msg._id, "in", timeDiff, "ms");
        continue;
      }

      // ✅ Mark as sent in DB
      msg.sent = true;
      await msg.save();

      // ✅ Populate message
      const populatedMsg = await Message.findById(msg._id)
        .populate("sender", "username name picture _id email status")
        .populate({
          path: "conversation",
          populate: {
            path: "users",
            select: "username name picture email status",
          },
        });

      // ✅ Emit to conversation room
      io.to(populatedMsg.conversation._id.toString()).emit(
        "sendMessage",
        populatedMsg
      );

      console.log("📩 Sent scheduled message:", populatedMsg._id);
    }
  }, 1000); // ⏲️ Check every 30 seconds
};
