import express from "express";
import authRoutes from "./auth.route.js";
// import authRoutes from "./auth.router.js";
import userROutes from "./user.route.js";
import ConversationRoutes from "./conversation.route.js";
import MessageRoutes from "./message.route.js";
import translationRoutes from "./translation.js";
const router = express.Router();

router.use("/auth", authRoutes);
router.use("/user", userROutes);
router.use("/conversation", ConversationRoutes);
router.use("/message", MessageRoutes);
router.use("/translate", translationRoutes);
export default router;
