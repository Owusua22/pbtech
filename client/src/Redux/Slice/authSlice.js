// frontend/src/redux/slices/authSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  registerUser,
  loginUser,
  registerAdmin,
  loginAdmin,
  getProfile,
  updateProfile,
  deleteProfile,
  changePassword,
  getAllUsers,
  getUserById,
  updateUserRole,
} from "../../api";

import { jwtDecode } from "jwt-decode";

/*
---------------------------------
Token Validation
---------------------------------
*/

const storedToken = localStorage.getItem("token");
let token = null;
let user = null;

if (storedToken) {
  try {
    const decoded = jwtDecode(storedToken);
    const expired = decoded.exp * 1000 < Date.now();

    if (!expired) {
      token = storedToken;
      user = JSON.parse(localStorage.getItem("user"));
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  } catch {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
}

/*
---------------------------------
Initial State
---------------------------------
*/

const initialState = {
  user: user,
  token: token,
  users: [],
  selectedUser: null,
  loading: false,
  error: null,
};

/*
---------------------------------
Error Handler
---------------------------------
*/

const handleError = (err, message) =>
  err.response?.data?.error || err.response?.data?.message || message;

/*
---------------------------------
AUTH THUNKS
---------------------------------
*/

// User Register
export const register = createAsyncThunk("auth/register", async (data, thunkAPI) => {
  try {
    const res = await registerUser(data);

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(handleError(err, "Registration failed"));
  }
});

// User Login
export const login = createAsyncThunk("auth/login", async (data, thunkAPI) => {
  try {
    const res = await loginUser(data);

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(handleError(err, "Login failed"));
  }
});

// Admin Register
export const adminRegister = createAsyncThunk(
  "auth/adminRegister",
  async (data, thunkAPI) => {
    try {
      const res = await registerAdmin(data);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(handleError(err, "Admin registration failed"));
    }
  }
);

// Admin Login
export const adminLogin = createAsyncThunk(
  "auth/adminLogin",
  async (data, thunkAPI) => {
    try {
      const res = await loginAdmin(data);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(handleError(err, "Admin login failed"));
    }
  }
);

/*
---------------------------------
USER PROFILE THUNKS
---------------------------------
*/

export const fetchProfile = createAsyncThunk("auth/profile", async (_, thunkAPI) => {
  try {
    const res = await getProfile();

    localStorage.setItem("user", JSON.stringify(res.data));

    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(handleError(err, "Failed to load profile"));
  }
});

export const updateUser = createAsyncThunk("auth/updateUser", async (data, thunkAPI) => {
  try {
    const res = await updateProfile(data);

    localStorage.setItem("user", JSON.stringify(res.data.user));

    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(handleError(err, "Profile update failed"));
  }
});

export const deleteUserAccount = createAsyncThunk(
  "auth/deleteUser",
  async (_, thunkAPI) => {
    try {
      const res = await deleteProfile();

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(handleError(err, "Delete failed"));
    }
  }
);

export const changeUserPassword = createAsyncThunk(
  "auth/changePassword",
  async (data, thunkAPI) => {
    try {
      const res = await changePassword(data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(handleError(err, "Password change failed"));
    }
  }
);

/*
---------------------------------
ADMIN USER MANAGEMENT
---------------------------------
*/

export const fetchAllUsers = createAsyncThunk(
  "auth/fetchAllUsers",
  async (_, thunkAPI) => {
    try {
      const res = await getAllUsers();
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(handleError(err, "Failed to fetch users"));
    }
  }
);

export const fetchUserById = createAsyncThunk(
  "auth/fetchUserById",
  async (id, thunkAPI) => {
    try {
      const res = await getUserById(id);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(handleError(err, "Failed to fetch user"));
    }
  }
);

export const updateUserRoleThunk = createAsyncThunk(
  "auth/updateUserRole",
  async ({ id, role }, thunkAPI) => {
    try {
      const res = await updateUserRole(id, role);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(handleError(err, "Failed to update role"));
    }
  }
);

/*
---------------------------------
SLICE
---------------------------------
*/

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },

  extraReducers: (builder) => {
    builder

      // Register
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
      })

      // Login
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
      })

      // Admin Register
      .addCase(adminRegister.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
      })

      // Admin Login
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
      })

      // Profile
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      })

      // Update Profile
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })

      // Delete User
      .addCase(deleteUserAccount.fulfilled, (state) => {
        state.user = null;
        state.token = null;
      })

      // Admin: Get Users
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })

      // Admin: Get User
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.selectedUser = action.payload;
      })

      // Admin: Update Role
      .addCase(updateUserRoleThunk.fulfilled, (state, action) => {
        const updated = action.payload.user;

        state.users = state.users.map((u) =>
          u._id === updated._id ? updated : u
        );
      });
  },
});

/*
---------------------------------
Token Expiry Watcher
---------------------------------
*/

export const startTokenExpiryWatcher = (dispatch, token) => {
  if (!token) return;

  try {
    const decoded = jwtDecode(token);
    const expiryTime = decoded.exp * 1000 - Date.now();

    if (expiryTime > 0) {
      setTimeout(() => {
        dispatch(logout());
        window.location.href = "/";
      }, expiryTime);
    } else {
      dispatch(logout());
      window.location.href = "/";
    }
  } catch {
    dispatch(logout());
    window.location.href = "/";
  }
};

export const { logout } = authSlice.actions;

export default authSlice.reducer;