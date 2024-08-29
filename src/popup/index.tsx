import "../global.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { proxyStore } from "../app/proxy-store";
import { Popup } from "./popup";

proxyStore.ready().then(() => {
  createRoot(document.getElementById("root") as HTMLElement).render(
    <StrictMode>
      <Provider store={proxyStore}>
        <Popup />
      </Provider>
    </StrictMode>,
  );
});
