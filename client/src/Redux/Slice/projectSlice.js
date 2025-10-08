import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  toggleArchiveProject,
  getProjectsByClient,
  getProjectsByUser,
  uploadProjectMedia,
  deleteProjectMedia,
} from "../../api";

// --- Async Thunks --- //
export const fetchProjects = createAsyncThunk("projects/fetchAll", async (_, thunkAPI) => {
  try {
    const { data } = await getProjects();
    return data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const addProject = createAsyncThunk("projects/create", async (projectData, thunkAPI) => {
  try {
    const { data } = await createProject(projectData);
    return data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const editProject = createAsyncThunk(
  "projects/update",
  async ({ id, projectData }, thunkAPI) => {
    try {
      const { data } = await updateProject(id, projectData);
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const removeProject = createAsyncThunk("projects/delete", async (id, thunkAPI) => {
  try {
    await deleteProject(id);
    return id;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const archiveProject = createAsyncThunk("projects/archive", async (id, thunkAPI) => {
  try {
    const { data } = await toggleArchiveProject(id);
    return data.project;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const fetchProjectsByClient = createAsyncThunk("projects/fetchByClient", async (clientId, thunkAPI) => {
  try {
    const { data } = await getProjectsByClient(clientId);
    return data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const fetchProjectsByUser = createAsyncThunk("projects/fetchByUser", async (userId, thunkAPI) => {
  try {
    const { data } = await getProjectsByUser(userId);
    return data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

// --- Media Thunks --- //
export const addProjectMedia = createAsyncThunk(
  "projects/addMedia",
  async ({ projectId, file }, thunkAPI) => {
    try {
      const { data } = await uploadProjectMedia(projectId, file);
      return { projectId, media: data }; // backend should return uploaded media object
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const removeProjectMedia = createAsyncThunk(
  "projects/removeMedia",
  async ({ projectId, mediaId }, thunkAPI) => {
    try {
      await deleteProjectMedia(projectId, mediaId);
      return { projectId, mediaId };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// --- Slice --- //
const projectSlice = createSlice({
  name: "projects",
  initialState: {
    projects: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // --- Fetch all ---
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- Create ---
      .addCase(addProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects.push(action.payload);
      })
      .addCase(addProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- Update ---
      .addCase(editProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editProject.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.projects.findIndex((p) => p._id === action.payload._id);
        if (index !== -1) state.projects[index] = action.payload;
      })
      .addCase(editProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- Delete ---
      .addCase(removeProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = state.projects.filter((p) => p._id !== action.payload);
      })
      .addCase(removeProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- Archive/Unarchive ---
      .addCase(archiveProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(archiveProject.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.projects.findIndex((p) => p._id === action.payload._id);
        if (index !== -1) state.projects[index] = action.payload;
      })
      .addCase(archiveProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- Fetch by Client ---
      .addCase(fetchProjectsByClient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectsByClient.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjectsByClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- Fetch by User ---
      .addCase(fetchProjectsByUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectsByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjectsByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- Media Upload ---
      .addCase(addProjectMedia.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProjectMedia.fulfilled, (state, action) => {
        state.loading = false;
        const { projectId, media } = action.payload;
        const project = state.projects.find((p) => p._id === projectId);
        if (project) {
          project.media.push(media);
        }
      })
      .addCase(addProjectMedia.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- Media Delete ---
      .addCase(removeProjectMedia.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeProjectMedia.fulfilled, (state, action) => {
        state.loading = false;
        const { projectId, mediaId } = action.payload;
        const project = state.projects.find((p) => p._id === projectId);
        if (project) {
          project.media = project.media.filter((m) => m._id !== mediaId);
        }
      })
      .addCase(removeProjectMedia.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default projectSlice.reducer;
