import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { proxyStore } from "../app/proxy-store";
import { Content } from "./content";

proxyStore.ready().then(() => {
  const root = document.body;

  const extRoot = document.createElement("div");

  root.appendChild(extRoot);

  createRoot(extRoot).render(
    <StrictMode>
      <Provider store={proxyStore}>
        <Content />
      </Provider>
    </StrictMode>,
  );
});
