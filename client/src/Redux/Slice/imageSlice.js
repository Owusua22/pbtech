import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { uploadImage, getImages, deleteImage, updateImage } from "../../api";
import { message } from "antd";

// ---------- Async Thunks ----------

// 📸 Fetch all images
export const fetchImages = createAsyncThunk("images/fetchAll", async (_, thunkAPI) => {
  try {
    const { data } = await getImages();
    return data;
  } catch (error) {
    message.error("Failed to fetch images");
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

// 📤 Upload new image
export const uploadNewImage = createAsyncThunk("images/upload", async (file, thunkAPI) => {
  try {
    const { data } = await uploadImage(file);
    message.success("Image uploaded successfully");
    return data;
  } catch (error) {
    message.error("Failed to upload image");
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

// 🗑️ Delete image
export const removeImage = createAsyncThunk("images/delete", async (id, thunkAPI) => {
  try {
    await deleteImage(id);
    message.success("Image deleted successfully");
    return id;
  } catch (error) {
    message.error("Failed to delete image");
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

// ✏️ Update image (name or replace file)
export const editImage = createAsyncThunk("images/update", async ({ id, file, name }, thunkAPI) => {
  try {
    const { data } = await updateImage(id, file, name);
    message.success("Image updated successfully");
    return data.updatedImage;
  } catch (error) {
    message.error("Failed to update image");
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

// ---------- Slice ----------
const imageSlice = createSlice({
  name: "images",
  initialState: {
    images: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 📸 Fetch images
      .addCase(fetchImages.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchImages.fulfilled, (state, action) => {
        state.loading = false;
        state.images = action.payload;
      })
      .addCase(fetchImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 📤 Upload image
      .addCase(uploadNewImage.fulfilled, (state, action) => {
        state.images.unshift(action.payload);
      })

      // 🗑️ Delete image
      .addCase(removeImage.fulfilled, (state, action) => {
        state.images = state.images.filter((img) => img._id !== action.payload);
      })

      // ✏️ Update image
      .addCase(editImage.fulfilled, (state, action) => {
        const index = state.images.findIndex((img) => img._id === action.payload._id);
        if (index !== -1) {
          state.images[index] = action.payload;
        }
      });
  },
});

export default imageSlice.reducer;
