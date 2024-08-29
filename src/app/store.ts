import { wrapStore } from "@eduardoac-skimlinks/webext-redux";
import { type Action, type ThunkAction, combineReducers, configureStore } from "@reduxjs/toolkit";
import { localStorage } from "redux-persist-webextension-storage";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from "reduxjs-toolkit-persist";
import type { WebStorage } from "reduxjs-toolkit-persist/lib/types";

import { counterReducer } from "./features/counter/counter-slice";

const persistConfig = {
  key: "root",
  storage: localStorage as WebStorage,
};

const reducers = combineReducers({
  counter: counterReducer,
});

const persistedReducer: typeof reducers = persistReducer(persistConfig, reducers);
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const initializeWrappedStore = () => wrapStore(store);

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
