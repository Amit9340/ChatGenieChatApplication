import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

const messageSchema = new mongoose.Schema(
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
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ConversationModel",
    },
    // conversation: {
    //   type: ObjectId,
    //   ref: "ConversationModel",
    // },
    files: [{ type: String }],
    // expiresAt: { type: Date, default: null },

    // expiresAt: { type: Date },
    // expiresAt: { type: Date, index: { expires: 0 }, default: null }
    expiresAt: {
      type: Date,
      default: null,
      index: { expires: 0 },
    },
    convo_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
    },
    scheduledAt: { type: Date },
    sent: { type: Boolean, default: false },
    createdAt: {
    type: Date,
    default: Date.now,
  },
  },
  {
    collection: "messages",
    timestamps: true,
  }
);
// messageSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
messageSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const MessageModel =
  mongoose.models.MessageModel || mongoose.model("MessageModel", messageSchema);

export default MessageModel;
