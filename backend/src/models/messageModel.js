import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

const messageSchema = mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "UserModel" },
    // sender: {
    //   type: ObjectId,
    //   ref: "UserModel",
    // },
    message: {
      type: String,
      trim: true,
    },
    conversation: { type: mongoose.Schema.Types.ObjectId, ref: "ConversationModel" },
    // conversation: {
    //   type: ObjectId,
    //   ref: "ConversationModel",
    // },
    files: [],
    expiresAt: { type: Date, default: null },
  },
  {
    collection: "messages",
    timestamps: true,
  }
);
// messageSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const MessageModel =
  mongoose.models.MessageModel || mongoose.model("MessageModel", messageSchema);

export default MessageModel;
