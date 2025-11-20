
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AppNotification, LoadingStatus } from '../../types';
import { api } from '../../services/api';
import { RootState } from '../../store/store';

interface NotificationsState {
  items: AppNotification[];
  status: LoadingStatus;
  error: string | null;
}

const initialState: NotificationsState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (_, { getState }) => {
    const state = getState() as RootState;
    const orgId = state.orgs.activeOrgId;
    if (!orgId) return [];
    const response = await api.notifications.list(orgId);
    return response;
  }
);

export const markNotificationRead = createAsyncThunk(
  'notifications/markRead',
  async (id: string, { getState }) => {
    const state = getState() as RootState;
    const orgId = state.orgs.activeOrgId;
    if (!orgId) throw new Error("No active org");
    await api.notifications.markRead(orgId, id);
    return id;
  }
);

export const markAllNotificationsRead = createAsyncThunk(
  'notifications/markAllRead',
  async (_, { getState }) => {
    const state = getState() as RootState;
    const orgId = state.orgs.activeOrgId;
    if (!orgId) throw new Error("No active org");
    await api.notifications.markAllRead(orgId);
    return true;
  }
);

export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch notifications';
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const item = state.items.find(i => i.id === action.payload);
        if (item) item.read = true;
      })
      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        state.items.forEach(i => i.read = true);
      });
  },
});

export default notificationsSlice.reducer;
