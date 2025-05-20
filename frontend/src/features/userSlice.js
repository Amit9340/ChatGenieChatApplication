import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT || "http://localhost:5000/api/v1"; 
const AUTH_ENDPOINT = `${API_ENDPOINT}/auth`;

//const AUTH_ENDPOINT = `${process.env.REACT_APP_API_ENDPOINT}/auth`;

const initialState = {
  status: "",
  error: "",
  user: {
    id: "",
    name: "",
    email: "",
    picture: "",
    status: "",
    token: "",
    socketId: "",
    currentUser: null,
    selectedChat: null,
  },
};

export const registerUser = createAsyncThunk(
  "auth/register",
  async (values, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${AUTH_ENDPOINT}/register`, {
        ...values,
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.error.message);
    }
  }
);
export const loginUser = createAsyncThunk(
  "auth/login",
  async (values, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${AUTH_ENDPOINT}/login`, {
        ...values,
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.error.message);
    }
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.status = "";
      state.error = "";
      state.user = {
        id: "",
        name: "",
        email: "",
        picture: "",
        status: "",
        token: "",
        socketId: "",
      };
    },
    changeStatus: (state, action) => {
      state.status = action.payload;
    },
    updateSocketId: (state, action) => {
      state.user.socketId = action.payload;
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    setSelectedChat: (state, action) => {
      state.selectedChat = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(registerUser.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = "";
        state.user = {
          ...action.payload.user,
          socketId: "", // ensure socketId is at least initialized
        };
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = "";
        state.user = {
          ...action.payload.user,
          socketId: action.payload.user.socketId || "", // ✅ correct socketId setting
        };
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { logout, changeStatus, updateSocketId, setCurrentUser, setSelectedChat } = userSlice.actions;

export default userSlice.reducer;
