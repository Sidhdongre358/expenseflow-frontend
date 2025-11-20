
import { configureStore } from '@reduxjs/toolkit';
import uiReducer from '../features/ui/uiSlice';
import expensesReducer from '../features/expenses/expensesSlice';
import budgetsReducer from '../features/budgets/budgetsSlice';
import userReducer from '../features/user/userSlice';
import authReducer from '../features/auth/authSlice';
import notificationsReducer from '../features/notifications/notificationsSlice';
import orgReducer from '../features/org/orgSlice';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    auth: authReducer,
    expenses: expensesReducer,
    budgets: budgetsReducer,
    user: userReducer,
    notifications: notificationsReducer,
    orgs: orgReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
