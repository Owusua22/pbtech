import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  archiveAppointment, // ✅ import
} from "../../api";

// --------- Async Thunks ---------

// Fetch all appointments
export const fetchAppointments = createAsyncThunk(
  "appointments/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await getAppointments();
      return data.data; // API returns { success, data }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Fetch single appointment
export const fetchAppointmentById = createAsyncThunk(
  "appointments/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await getAppointmentById(id);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Create appointment
export const addAppointment = createAsyncThunk(
  "appointments/create",
  async (appointmentData, { rejectWithValue }) => {
    try {
      const { data } = await createAppointment(appointmentData);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Update appointment
export const editAppointment = createAsyncThunk(
  "appointments/update",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const { data } = await updateAppointment(id, updates);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Delete appointment (hard delete)
export const removeAppointment = createAsyncThunk(
  "appointments/delete",
  async (id, { rejectWithValue }) => {
    try {
      await deleteAppointment(id);
      return id; // return deleted id
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Archive appointment (soft delete)
export const archiveAppointmentThunk = createAsyncThunk(
  "appointments/archive",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await archiveAppointment(id);
      return { id, data }; // return id + updated appointment
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// --------- Slice ---------
const appointmentSlice = createSlice({
  name: "appointments",
  initialState: {
    items: [],
    current: null,
    loading: false,
    error: null,
    success: false, // to track last operation
  },
  reducers: {
    clearCurrentAppointment: (state) => {
      state.current = null;
    },
    clearStatus: (state) => {
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder

      // -------- Fetch All --------
      .addCase(fetchAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.success = true;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // -------- Fetch One --------
      .addCase(fetchAppointmentById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(fetchAppointmentById.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
        state.success = true;
      })
      .addCase(fetchAppointmentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // -------- Create --------
      .addCase(addAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
        state.success = true;
      })
      .addCase(addAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // -------- Update --------
      .addCase(editAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(editAppointment.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.items.findIndex((a) => a._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
        if (state.current?._id === action.payload._id) {
          state.current = action.payload;
        }
        state.success = true;
      })
      .addCase(editAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // -------- Delete (hard) --------
      .addCase(removeAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(removeAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((a) => a._id !== action.payload);
        if (state.current?._id === action.payload) {
          state.current = null;
        }
        state.success = true;
      })
      .addCase(removeAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // -------- Archive (soft delete) --------
      .addCase(archiveAppointmentThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(archiveAppointmentThunk.fulfilled, (state, action) => {
        state.loading = false;
        // Remove from items (hide archived)
        state.items = state.items.filter((a) => a._id !== action.payload.id);
        if (state.current?._id === action.payload.id) {
          state.current = null;
        }
        state.success = true;
      })
      .addCase(archiveAppointmentThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { clearCurrentAppointment, clearStatus } = appointmentSlice.actions;

export default appointmentSlice.reducer;
