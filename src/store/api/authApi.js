import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Load auth from localStorage
const loadAuthFromStorage = () => {
  const token = localStorage.getItem("token");
  const student = localStorage.getItem("student");
  if (token && student) {
    return { token, student: JSON.parse(student) };
  }
  return { token: null, student: null };
};

// Async thunks
export const login = createAsyncThunk(
  "auth/login",
  async ({ student_id, password }) => {
    const response = await axios.post(`${API_URL}/auth/student/login`, {
      student_id,
      password,
    });
    return response.data;
  }
);

export const getProfile = createAsyncThunk(
  "auth/getProfile",
  async (_, { getState }) => {
    const token = getState().auth.token;
    const response = await axios.get(`${API_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (data, { getState }) => {
    const token = getState().auth.token;
    const response = await axios.put(`${API_URL}/student/profile`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }
);

const initialState = {
  ...loadAuthFromStorage(),
  loading: false,
  error: null,
  firstLogin: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.student = null;
      localStorage.removeItem("token");
      localStorage.removeItem("student");
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          state.token = action.payload.data.token;
          state.student = action.payload.data.student;
          state.firstLogin = action.payload.data.firstLogin || false;
          localStorage.setItem("token", action.payload.data.token);
          localStorage.setItem(
            "student",
            JSON.stringify(action.payload.data.student)
          );
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Get Profile
      .addCase(getProfile.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.student = action.payload.data;
          localStorage.setItem("student", JSON.stringify(action.payload.data));
        }
      })
      // Update Profile
      .addCase(updateProfile.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.student = action.payload.data;
          localStorage.setItem("student", JSON.stringify(action.payload.data));
        }
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
