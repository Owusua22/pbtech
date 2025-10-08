// frontend/src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Slice/authSlice";
import clientReducer from "./Slice/clientSlice";
import projectReducer from "./Slice/projectSlice";
import taskReducer from "./Slice/taskSlice";
import appointmentReducer from "./Slice/appointmentSlice"; // new reducer
import imageReducer from "./Slice/imageSlice"; // new reducer

const store = configureStore({
  reducer: {
    auth: authReducer,
    clients: clientReducer,
    projects: projectReducer,
    tasks: taskReducer,
    appointments: appointmentReducer, // new reducer
    images: imageReducer, // new reducer
  },
});

export default store;
