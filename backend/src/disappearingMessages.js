// // backend/disappearingMessages.js
// import mongoose from "mongoose";
// import Message from "./models/MessageModel.js";  // Correct path

// // Function to delete expired messages
// async function deleteExpiredMessages(io) {
//     const now = new Date();
//     const expiredMessages = await Message.find({ expiresAt: { $lte: now } });

//     for (const msg of expiredMessages) {
//         io.to(msg.receiver.toString()).emit("deleteMessage", msg._id);
//         await Message.findByIdAndDelete(msg._id);
//     }
// }

// // Run every 30 seconds
// setInterval(() => deleteExpiredMessages(io), 30 * 1000);

// // Set interval to check and delete expired messages every minute
// // setInterval(deleteExpiredMessages, 60 * 1000);

// export default (io) => {
//     io.on("connection", (socket) => {
//         socket.on("sendMessage", async ({ sender, receiver, content, expiresAt }) => {
//             const message = new Message({ sender, conversation: receiver, message: content, expiresAt });
//             await message.save();
//             io.to(receiver).emit("newMessage", message);
//         });
//     });
// };





// backend/disappearingMessages.js
// import mongoose from "mongoose";
// import cron from "node-cron";
// import { Server } from "socket.io";
// import Message from "./models/messageModel.js"; // Correct path

// export default (io) => {
//     // Function to delete expired messages
//     async function deleteExpiredMessages() {
//         const now = new Date();
//         const expiredMessages = await Message.find({ expiresAt: { $lte: now } });

//         for (const msg of expiredMessages) {
//             io.to(msg.conversation.toString()).emit("deleteMessage", msg._id);
//             await Message.findByIdAndDelete(msg._id);
//         }
//     }

//     // Run every 30 seconds (inside the function so io is available)
//     setInterval(deleteExpiredMessages, 30 * 1000);

//     io.on("connection", (socket) => {
//         socket.on("sendMessage", async ({ sender, receiver, content, expiresAt }) => {
//             const message = new Message({ 
//                 sender, 
//                 conversation: receiver, // `conversation` instead of `receiver`
//                 message: content, 
//                 expiresAt 
//             });

//             await message.save();
//             io.to(receiver).emit("newMessage", message);
//         });
//     });
// };



import mongoose from "mongoose";
import cron from "node-cron";
import Message from "./models/messageModel.js"; // Correct path

export default (io) => {
    // Function to delete expired messages
    async function deleteExpiredMessages() {
        const now = new Date();
        const expiredMessages = await Message.find({ expiresAt: { $lte: now } });

        for (const msg of expiredMessages) {
            io.to(msg.conversation.toString()).emit("deleteMessage", msg._id);
            await Message.findByIdAndDelete(msg._id);
        }
    }

    // Run every 30 seconds using node-cron
    cron.schedule("*/30 * * * * *", deleteExpiredMessages);

    io.on("connection", (socket) => {
        socket.on("joinRoom", (conversationId) => {
            socket.join(conversationId);
        });

        socket.on("sendMessage", async ({ sender, receiver, content, expiresAt }) => {
            const message = new Message({ 
                sender, 
                conversation: receiver, // `conversation` instead of `receiver`
                message: content, 
                expiresAt 
            });

            await message.save();
            io.to(receiver).emit("newMessage", message);
        });
    });
};
console.log(`[CRON] Checking for expired messages at ${now.toISOString()}`);
console.log(`[CRON] Found ${expiredMessages.length} expired messages`);