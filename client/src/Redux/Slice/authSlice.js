// frontend/src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  deleteProfile,
  changePassword,
  getAllUsers,
  getUserById,
  updateUserRole,
} from "../../api";
import { jwtDecode } from "jwt-decode";

const token = localStorage.getItem("token");
let user = null;
let validToken = null;

if (token) {
  try {
    const decoded = jwtDecode(token);
    const isExpired = decoded.exp * 1000 < Date.now();

    if (!isExpired) {
      validToken = token;
      user = JSON.parse(localStorage.getItem("user"));
    } else {
      // If expired, clear local storage immediately
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  } catch (error) {
    console.error("Invalid token:", error);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
}





// ---------------- Initial State ----------------
const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  users: [], // for admin
  selectedUser: null, // for admin viewing/editing a single user
  loading: false,
  error: null,
};

// ---------------- Helpers ----------------
const handleError = (err, defaultMsg) =>
  err.response?.data?.error || err.response?.data?.message || defaultMsg;

// ---------------- Thunks ----------------
// Register
export const register = createAsyncThunk("auth/register", async (userData, thunkAPI) => {
  try {
    const res = await registerUser(userData);

    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
    }

    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(handleError(err, "Registration failed"));
  }
});

// Login
export const login = createAsyncThunk("auth/login", async (credentials, thunkAPI) => {
  try {
    const res = await loginUser(credentials);

    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
    }

    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(handleError(err, "Login failed"));
  }
});

// Get Profile
export const fetchProfile = createAsyncThunk("auth/profile", async (_, thunkAPI) => {
  try {
    const res = await getProfile();

    // refresh user in localStorage
    localStorage.setItem("user", JSON.stringify(res.data));

    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(handleError(err, "Failed to load profile"));
  }
});

// Update Profile
export const updateUser = createAsyncThunk("auth/updateUser", async (data, thunkAPI) => {
  try {
    const res = await updateProfile(data);

    // update user in localStorage
    localStorage.setItem("user", JSON.stringify(res.data.user));

    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(handleError(err, "Update failed"));
  }
});

// Delete Profile
export const deleteUser = createAsyncThunk("auth/deleteUser", async (_, thunkAPI) => {
  try {
    const res = await deleteProfile();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(handleError(err, "Delete failed"));
  }
});

// Change Password
export const changeUserPassword = createAsyncThunk("auth/changePassword", async (data, thunkAPI) => {
  try {
    const res = await changePassword(data);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(handleError(err, "Password change failed"));
  }
});

// Admin: Get All Users
export const fetchAllUsers = createAsyncThunk("auth/getAllUsers", async (_, thunkAPI) => {
  try {
    const res = await getAllUsers();
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(handleError(err, "Failed to fetch users"));
  }
});

// Admin: Get User By Id
export const fetchUserById = createAsyncThunk("auth/getUserById", async (id, thunkAPI) => {
  try {
    const res = await getUserById(id);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(handleError(err, "Failed to fetch user"));
  }
});

// Admin: Update User Role
export const updateUserRoleThunk = createAsyncThunk("auth/updateUserRole", async ({ id, role }, thunkAPI) => {
  try {
    const res = await updateUserRole(id, role);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(handleError(err, "Failed to update role"));
  }
});

// ---------------- Slice ----------------
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
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Profile
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Profile
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Profile
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Change Password
      .addCase(changeUserPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(changeUserPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(changeUserPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Admin: Get All Users
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Admin: Get User By Id
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Admin: Update User Role
      .addCase(updateUserRoleThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserRoleThunk.fulfilled, (state, action) => {
        state.loading = false;
        const updatedUser = action.payload.user;
        state.users = state.users.map((u) => (u._id === updatedUser._id ? updatedUser : u));
      })
      .addCase(updateUserRoleThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
      
  },
  
});
// ✅ move this OUTSIDE the createSlice (below it)
export const startTokenExpiryWatcher = (dispatch, token) => {
  if (!token) return;

  try {
    const decoded = jwtDecode(token);
    const expiryTime = decoded.exp * 1000 - Date.now();

    if (expiryTime > 0) {
      setTimeout(() => {
        dispatch(logout());
        window.location.href = "/"; // redirect to  page
      }, expiryTime);
    } else {
      dispatch(logout());
      window.location.href = "/";
    }
  } catch (error) {
    console.error("Error decoding token:", error);
    dispatch(logout());
    window.location.href = "/";
  }
};

export const { logout } = authSlice.actions;
export default authSlice.reducer;
