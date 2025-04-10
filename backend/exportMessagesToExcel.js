// exportMessagesToExcel.js
import mongoose from "mongoose";
import XLSX from "xlsx";
import Message from "./src/models/messageModel.js";
import UserModel from "./src/models/userModel.js";
import ConversationModel from "./src/models/conversationModel.js";

const MONGO_URI =
  "mongodb+srv://diya5555:diya5555@chatgenie.o6j0a.mongodb.net/?retryWrites=true&w=majority&appName=ChatGenie";

const exportToExcel = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Fetch messages
    const messages = await Message.find({})
      .populate("sender", "name email")
      .populate("conversation", "name");

    // Prepare data
    const formatted = messages.map((msg) => ({
      ID: msg._id.toString(),
      Sender: msg.sender?.name || "Unknown",
      Email: msg.sender?.email || "Unknown",
      Message: msg.message,
      Conversation: msg.conversation?.name || "Unknown",
      ExpiresAt: msg.expiresAt ? new Date(msg.expiresAt).toISOString() : "N/A",
      CreatedAt: new Date(msg.createdAt).toISOString(),
    }));

    // Create workbook and sheet
    const worksheet = XLSX.utils.json_to_sheet(formatted);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Messages");

    // ✅ Write to file with unique name
    const fileName = `messages_export_${Date.now()}.xlsx`;
    XLSX.writeFile(workbook, fileName);
    console.log(`📁 Exported to ${fileName}`);

    mongoose.disconnect();
  } catch (error) {
    console.error("❌ Error exporting messages:", error.message);
  }
};

exportToExcel();
