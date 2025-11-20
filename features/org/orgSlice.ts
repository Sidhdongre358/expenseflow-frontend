import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Organization, OrgMember, LoadingStatus } from '../../types';
import { api } from '../../services/api';
import { RootState } from '../../store/store';

interface OrgState {
  activeOrgId: string | null;
  activeOrg: Organization | null;
  myOrgs: Organization[];
  members: OrgMember[];
  status: LoadingStatus;
  error: string | null;
}

const initialState: OrgState = {
  activeOrgId: null,
  activeOrg: null,
  myOrgs: [],
  members: [],
  status: 'idle',
  error: null,
};

export const fetchMyOrgs = createAsyncThunk(
  'org/fetchMyOrgs',
  async () => {
    const orgs = await api.orgs.listMyOrgs();
    return orgs;
  }
);

export const createOrganization = createAsyncThunk(
    'org/create',
    async ({ name, slug }: { name: string; slug: string }) => {
        return await api.orgs.create(name, slug);
    }
);

export const fetchOrgMembers = createAsyncThunk(
    'org/fetchMembers',
    async (_, { getState }) => {
        const state = getState() as RootState;
        const orgId = state.orgs.activeOrgId;
        if (!orgId) throw new Error("No active org");
        return await api.orgs.getMembers(orgId);
    }
);

export const inviteMember = createAsyncThunk(
    'org/inviteMember',
    async ({ email, role }: { email: string; role: string }, { getState }) => {
        const state = getState() as RootState;
        const orgId = state.orgs.activeOrgId;
        if (!orgId) throw new Error("No active org");
        return await api.orgs.inviteMember(orgId, email, role);
    }
);

export const removeMember = createAsyncThunk(
    'org/removeMember',
    async (userId: string, { getState }) => {
        const state = getState() as RootState;
        const orgId = state.orgs.activeOrgId;
        if (!orgId) throw new Error("No active org");
        await api.orgs.removeMember(orgId, userId);
        return userId;
    }
);

export const updateMemberRole = createAsyncThunk(
    'org/updateMemberRole',
    async ({ userId, role }: { userId: string; role: string }, { getState }) => {
        const state = getState() as RootState;
        const orgId = state.orgs.activeOrgId;
        if (!orgId) throw new Error("No active org");
        return await api.orgs.updateMemberRole(orgId, userId, role);
    }
);

export const updateOrgSettings = createAsyncThunk(
    'org/updateSettings',
    async (updates: Partial<Organization>, { getState }) => {
        const state = getState() as RootState;
        const orgId = state.orgs.activeOrgId;
        if (!orgId) throw new Error("No active org");
        return await api.orgs.updateSettings(orgId, updates);
    }
);

export const addOrgCategory = createAsyncThunk(
    'org/addCategory',
    async (category: string, { getState }) => {
        const state = getState() as RootState;
        const orgId = state.orgs.activeOrgId;
        if (!orgId) throw new Error("No active org");
        return await api.orgs.addCategory(orgId, category);
    }
);

export const removeOrgCategory = createAsyncThunk(
    'org/removeCategory',
    async (category: string, { getState }) => {
        const state = getState() as RootState;
        const orgId = state.orgs.activeOrgId;
        if (!orgId) throw new Error("No active org");
        return await api.orgs.removeCategory(orgId, category);
    }
);

export const orgSlice = createSlice({
  name: 'org',
  initialState,
  reducers: {
    setActiveOrg: (state, action: PayloadAction<string>) => {
        state.activeOrgId = action.payload;
        state.activeOrg = state.myOrgs.find(o => o.id === action.payload) || null;
        // When switching orgs, we clear members so they reload for the new org
        state.members = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyOrgs.fulfilled, (state, action) => {
        state.myOrgs = action.payload;
        // Auto-select first org if none selected
        if (!state.activeOrgId && action.payload.length > 0) {
            state.activeOrgId = action.payload[0].id;
            state.activeOrg = action.payload[0];
        }
      })
      .addCase(createOrganization.fulfilled, (state, action) => {
          state.myOrgs.push(action.payload);
          // Automatically switch to new org
          state.activeOrgId = action.payload.id;
          state.activeOrg = action.payload;
      })
      .addCase(fetchOrgMembers.fulfilled, (state, action) => {
          state.members = action.payload;
      })
      .addCase(inviteMember.fulfilled, (state, action) => {
          state.members.push(action.payload);
      })
      .addCase(removeMember.fulfilled, (state, action) => {
          state.members = state.members.filter(m => m.userId !== action.payload);
      })
      .addCase(updateMemberRole.fulfilled, (state, action) => {
          const idx = state.members.findIndex(m => m.userId === action.payload.userId);
          if (idx !== -1) state.members[idx] = action.payload;
      })
      .addCase(updateOrgSettings.fulfilled, (state, action) => {
          state.activeOrg = action.payload;
          const idx = state.myOrgs.findIndex(o => o.id === action.payload.id);
          if (idx !== -1) state.myOrgs[idx] = action.payload;
      })
      .addCase(addOrgCategory.fulfilled, (state, action) => {
          if (state.activeOrg) {
              const currentCats = state.activeOrg.categories || [];
              if(!currentCats.includes(action.payload)) {
                  const newCats = [...currentCats, action.payload];
                  state.activeOrg.categories = newCats;
                  // Sync myOrgs
                  const idx = state.myOrgs.findIndex(o => o.id === state.activeOrgId);
                  if (idx !== -1) state.myOrgs[idx].categories = newCats;
              }
          }
      })
      .addCase(removeOrgCategory.fulfilled, (state, action) => {
          if (state.activeOrg && state.activeOrg.categories) {
              const newCats = state.activeOrg.categories.filter(c => c !== action.payload);
              state.activeOrg.categories = newCats;
              // Sync myOrgs
              const idx = state.myOrgs.findIndex(o => o.id === state.activeOrgId);
              if (idx !== -1) state.myOrgs[idx].categories = newCats;
          }
      });
  },
});

export const { setActiveOrg } = orgSlice.actions;
export default orgSlice.reducer;