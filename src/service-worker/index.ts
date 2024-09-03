import { browser } from "../app/config/browser";
import { initializeWrappedStore, store } from "../app/store";

initializeWrappedStore();

store.subscribe(() => {
  // access store state
  // const state = store.getState();
  // console.log('state', state);
});

// show welcome page on new install
browser.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === "install") {
    //show the welcome page
    const url = browser.runtime.getURL("welcome/welcome.html");
    await browser.tabs.create({ url });
  }
});

browser.webNavigation.onHistoryStateUpdated.addListener(
  (details) => {
    browser.tabs.sendMessage(details.tabId, {
      messageType: "URL_UPDATED",
      ...details,
    });
  },
  { url: [{ hostEquals: "github.com" }] },
);
