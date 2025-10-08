// frontend/src/redux/slices/clientSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getClients,
  createClient,
  updateClient,
  deleteClient,
} from "../../api";

const initialState = {
  clients: [],
  loading: false,
  error: null,
};

// ---------------- Thunks ----------------

// Fetch all clients
export const fetchClients = createAsyncThunk(
  "clients/fetchAll",
  async (_, thunkAPI) => {
    try {
      const res = await getClients();
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch clients"
      );
    }
  }
);

// Add new client
export const addClient = createAsyncThunk(
  "clients/add",
  async (clientData, thunkAPI) => {
    try {
      const res = await createClient(clientData);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to add client"
      );
    }
  }
);

// Edit client
export const editClient = createAsyncThunk(
  "clients/update",
  async ({ id, data }, thunkAPI) => {
    try {
      const res = await updateClient(id, data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to update client"
      );
    }
  }
);

// Delete client
export const removeClient = createAsyncThunk(
  "clients/delete",
  async (id, thunkAPI) => {
    try {
      await deleteClient(id);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to delete client"
      );
    }
  }
);

// ---------------- Slice ----------------

const clientSlice = createSlice({
  name: "clients",
  initialState,
  reducers: {
    clearClientError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // -------- Fetch Clients --------
      .addCase(fetchClients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
.addCase(fetchClients.fulfilled, (state, action) => {
  // Handle both array response or object response
  state.clients = Array.isArray(action.payload)
    ? action.payload
    : action.payload.clients || [];
  state.loading = false;
  state.error = null;
})

      .addCase(fetchClients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // -------- Add Client --------
      .addCase(addClient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addClient.fulfilled, (state, action) => {
        state.loading = false;
        state.clients.push(action.payload);
      })
      .addCase(addClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // -------- Edit Client --------
      .addCase(editClient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editClient.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.clients.findIndex(
          (c) => c._id === action.payload._id
        );
        if (index !== -1) state.clients[index] = action.payload;
      })
      .addCase(editClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // -------- Remove Client --------
      .addCase(removeClient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeClient.fulfilled, (state, action) => {
        state.loading = false;
        state.clients = state.clients.filter((c) => c._id !== action.payload);
      })
      .addCase(removeClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// ---------------- Exports ----------------
export const { clearClientError } = clientSlice.actions;
export default clientSlice.reducer;
