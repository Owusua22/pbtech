// frontend/src/redux/slices/taskSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getTasks, createTask, updateTask, deleteTask } from "../../api";

const initialState = {
  tasks: [],
  loading: false,
  error: null,
};

// Fetch all tasks
export const fetchTasks = createAsyncThunk(
  "tasks/fetchAll",
  async (_, thunkAPI) => {
    try {
      const res = await getTasks();
      return res.data; // array of populated tasks
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch tasks"
      );
    }
  }
);

// Add a task
export const addTask = createAsyncThunk(
  "tasks/add",
  async (taskData, thunkAPI) => {
    try {
      const res = await createTask(taskData);
      return res.data; // populated task
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to add task"
      );
    }
  }
);

// Update a task
export const editTask = createAsyncThunk(
  "tasks/update",
  async ({ id, data }, thunkAPI) => {
    try {
      const res = await updateTask(id, data);
      return res.data; // populated task
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to update task"
      );
    }
  }
);

// Delete a task
export const removeTask = createAsyncThunk(
  "tasks/delete",
  async (id, thunkAPI) => {
    try {
      const res = await deleteTask(id);
      return res.data._id || id; // backend should return deleted task id
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to delete task"
      );
    }
  }
);

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    clearTaskError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add
      .addCase(addTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.unshift(action.payload); // already populated
      })
      .addCase(addTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update
      .addCase(editTask.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tasks.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) {
          state.tasks[index] = action.payload; // replace with updated populated task
        }
      })
      .addCase(editTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(removeTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.filter((t) => t._id !== action.payload);
      })
      .addCase(removeTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearTaskError } = taskSlice.actions;
export default taskSlice.reducer;
