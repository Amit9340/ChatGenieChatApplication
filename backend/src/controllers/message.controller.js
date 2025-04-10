import logger from "../configs/logger.config.js";
import { updateLatestMessage } from "../services/conversation.service.js";
import {
  createMessage,
  getConvoMessages,
  populateMessage,
} from "../services/message.service.js";

export const sendMessage = async (req, res, next) => {
  try {
    const user_id = req.user.userId;
    const { message, convo_id, files, expiresAt, scheduledAt } = req.body;
    console.log("📥 Received expiresAt:", expiresAt); // Debugging
    if (!convo_id || (!message && !files)) {
      logger.error("Please provider a conversation id and a message body");
      return res.status(400).json({
        message: "Conversation ID and message or files are required.",
      });
    }
    const msgData = {
      sender: user_id,
      message,
      conversation: convo_id,
      files: files || [],
    };

    // Validate and set expiresAt if provided
    if (expiresAt) {
      const expiryDate = new Date(expiresAt);
      if (isNaN(expiryDate.getTime()) || expiryDate < new Date()) {
        logger.error("Invalid or past expiration date.");
        return res.status(400).json({
          message: "Invalid or past expiration date.",
        });
      }
      msgData.expiresAt = expiryDate;
      logger.info(
        `Disappearing message will expire at ${expiryDate.toISOString()}`
      );
    }

    if (scheduledAt) {
      msgData.scheduledAt = new Date(scheduledAt);
      msgData.sent = false; // Don't emit now, wait for scheduler
    }

    // let newMessage = await createMessage(msgData);
    // let populatedMessage = await populateMessage(newMessage._id);
    // await updateLatestMessage(convo_id, newMessage);
    // res.json(populatedMessage);

    let newMessage = await createMessage(msgData);
    let populatedMessage = await populateMessage(newMessage._id);

    const io = req.app.get("io"); // 👈 if you attached io to app in server.js
    // 🔥 Only emit if NOT a scheduled message
    if (!scheduledAt || new Date(scheduledAt) <= new Date()) {
      io.to(convo_id).emit("sendMessage", populatedMessage);
      console.log("⏳ Message scheduledAt:", scheduledAt);
      console.log("🕒 Current server time:", new Date());
    }

    await updateLatestMessage(convo_id, newMessage);
    res.json(populatedMessage);
  } catch (error) {
    next(error);
  }
};
export const getMessages = async (req, res, next) => {
  try {
    const convo_id = req.params.convo_id;
    if (!convo_id) {
      logger.error("Please add a conversation id in params.");
      return res.status(400).json({
        message: "Conversation ID is required in params.",
      });
    }
    const messages = await getConvoMessages(convo_id);
    const now = new Date();

    // Optional: Filter out expired messages
    const filteredMessages = messages.filter(
      (msg) => !msg.expiresAt || new Date(msg.expiresAt) > now
    );

    // res.json(messages);
    res.json(filteredMessages);
  } catch (error) {
    next(error);
  }
};
