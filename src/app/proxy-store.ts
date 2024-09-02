import { Store, applyMiddleware } from "@eduardoac-skimlinks/webext-redux";
import { thunk } from "redux-thunk";

export const proxyStore = applyMiddleware(new Store(), thunk);

// @see https://github.com/tshaddix/webext-redux/issues/286
Object.assign(proxyStore, {
  dispatch: proxyStore.dispatch.bind(proxyStore),
  getState: proxyStore.getState.bind(proxyStore),
  subscribe: proxyStore.subscribe.bind(proxyStore),
});
