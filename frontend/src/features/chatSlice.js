import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const CONVERSATION_ENDPOINT = `${process.env.REACT_APP_API_ENDPOINT}/conversation`;
const MESSAGE_ENDPOINT = `${process.env.REACT_APP_API_ENDPOINT}/message`;

const initialState = {
  selectedUser: null,
  status: "",
  error: "",
  conversations: [],
  activeConversation: {},
  messages: [],
  notifications: [],
  files: [],
};

//functions
export const getConversations = createAsyncThunk(
  "conversation/all",
  async (token, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(CONVERSATION_ENDPOINT, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.error.message);
    }
  }
);
export const open_create_conversation = createAsyncThunk(
  "conversation/open_create",
  async (values, { rejectWithValue }) => {
    const { token, receiver_id, isGroup } = values;
    try {
      const { data } = await axios.post(
        CONVERSATION_ENDPOINT,
        { receiver_id, isGroup },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.error.message);
    }
  }
);
export const getConversationMessages = createAsyncThunk(
  "conversation/messages",
  async (values, { rejectWithValue }) => {
    const { token, convo_id } = values;
    try {
      const { data } = await axios.get(`${MESSAGE_ENDPOINT}/${convo_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.error.message);
    }
  }
);
export const sendMessage = createAsyncThunk(
  "message/send",
  async (values, { rejectWithValue }) => {
    const { token, message, convo_id, files, expiresAt, scheduledAt } = values;
    // console.log("🚀 Sending expiresAt:", expiresAt); // Debugging
    console.log("Sending scheduledAt:", scheduledAt); // ✅ Debug print
    console.log("Sending expiresAt:", expiresAt);
    try {
      const { data } = await axios.post(
        MESSAGE_ENDPOINT,
        {
          message,
          convo_id,
          files,
          expiresAt,
          scheduledAt,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.error.message);
    }
  }
);
export const createGroupConversation = createAsyncThunk(
  "conversation/create_group",
  async (values, { rejectWithValue }) => {
    const { token, name, users } = values;
    try {
      const { data } = await axios.post(
        `${CONVERSATION_ENDPOINT}/group`,
        { name, users },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.error.message);
    }
  }
);
export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setActiveConversation: (state, action) => {
      state.activeConversation = action.payload;
    },
    //   //update messages
    //   let convo = state.activeConversation;
    //   if (convo && convo._id === action.payload.conversation._id) {
    //     state.messages = [...state.messages, action.payload];
    //   }
    //   //update conversations
    //   let conversation = {
    //     ...action.payload.conversation,
    //     latestMessage: action.payload,
    //   };
    //   let newConvos = [...state.conversations].filter(
    //     (c) => c._id !== conversation._id
    //   );
    //   newConvos.unshift(conversation);
    //   state.conversations = newConvos;
    // },

    updateMessagesAndConversations: (state, action) => {
      const exists = state.messages.find(
        (msg) => msg._id === action.payload._id
      );
      if (!exists) {
        state.messages.push(action.payload);
      }

      // Update conversations
      // let conversation = {
      //   ...action.payload.conversation,
      //   latestMessage: action.payload,
      // };

      const now = new Date();
      const msg = action.payload;

      const isDisplayable =
        msg.sent !== false || // already sent
        (msg.scheduledAt && new Date(msg.scheduledAt) <= now); // scheduled time arrived

      let conversation = {
        ...msg.conversation,
        latestMessage: isDisplayable ? msg : msg.conversation.latestMessage,
      };

      let newConvos = [...state.conversations].filter(
        (c) => c._id !== conversation._id
      );
      newConvos.unshift(conversation);
      state.conversations = newConvos;
    },
    

    addFiles: (state, action) => {
      state.files = [...state.files, action.payload];
    },
    clearFiles: (state, action) => {
      state.files = [];
    },
    removeFileFromFiles: (state, action) => {
      // let index = action.payload;
      // let files = [...state.files];
      // let fileToRemove = [files[index]];
      // state.files = files.filter((file) => !fileToRemove.includes(file));
      state.files = state.files.filter((_, i) => i !== action.payload);
    },
    // features/chatSlice.js for dissapearing messages.
    removeMessage: (state, action) => {
      const messageId = action.payload;
      state.messages = state.messages.filter((msg) => msg._id !== messageId);
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getConversations.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getConversations.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.conversations = action.payload;
      })
      .addCase(getConversations.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(open_create_conversation.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(open_create_conversation.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.activeConversation = action.payload;
        state.files = [];
      })
      .addCase(open_create_conversation.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getConversationMessages.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getConversationMessages.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.messages = action.payload;
      })
      .addCase(getConversationMessages.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(sendMessage.pending, (state, action) => {
        state.status = "loading";
      })

      // .addCase(sendMessage.fulfilled, (state, action) => {
      //   state.status = "succeeded";

      //   // ✅ Only add message if it is already marked as sent (not scheduled)
      //   if (action.payload.sent !== false) {
      //     state.messages = [...state.messages, action.payload];

      //     // let conversation = {
      //     //   ...action.payload.conversation,
      //     //   latestMessage: action.payload,
      //     // };

      //     const now = new Date();
      //     const msg = action.payload;

      //     const isDisplayable =
      //       msg.sent !== false || // already sent
      //       (msg.scheduledAt && new Date(msg.scheduledAt) <= now); // scheduled time arrived

      //     let conversation = {
      //       ...msg.conversation,
      //       latestMessage: isDisplayable ? msg : msg.conversation.latestMessage,
      //     };

      //     let newConvos = [...state.conversations].filter(
      //       (c) => c._id !== conversation._id
      //     );
      //     newConvos.unshift(conversation);
      //     state.conversations = newConvos;
      //   }

      //   state.files = [];
      // })

      .addCase(sendMessage.fulfilled, (state, action) => {
        state.status = "succeeded";
        const msg = action.payload;
        const now = new Date();
      
        const isDisplayable =
          msg.sent !== false || // Already sent (immediate message)
          (msg.scheduledAt && new Date(msg.scheduledAt) <= now); // Scheduled time arrived
      
        // ✅ Only add to chat screen if displayable
        if (isDisplayable) {
          state.messages = [...state.messages, msg];
        }
      
        // ✅ Update conversations only if it's displayable
        const convoId = msg.conversation._id;
        const oldConvo = state.conversations.find((c) => c._id === convoId);
      
        let updatedConvo = {
          ...msg.conversation,
          latestMessage: isDisplayable
            ? msg
            : oldConvo?.latestMessage || null, // don't overwrite with future msg
        };
      
        let newConvos = state.conversations.filter((c) => c._id !== convoId);
        newConvos.unshift(updatedConvo);
        state.conversations = newConvos;
      
        state.files = [];
      })
      

      .addCase(sendMessage.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});
export const {
  setActiveConversation,
  updateMessagesAndConversations,
  addFiles,
  clearFiles,
  removeFileFromFiles,
  removeMessage,
} = chatSlice.actions;

export default chatSlice.reducer;
