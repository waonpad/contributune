import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { proxyStore } from "../app/proxy-store";
import { Content } from "./content";

proxyStore.ready().then(() => {
  const contentRoot = document.createElement("div");
  contentRoot.id = "my-extension-root";
  contentRoot.style.display = "contents";
  document.body.append(contentRoot);
  const shadowRoot = contentRoot.attachShadow({ mode: "open" });
  const shadowWrapper = document.createElement("div");
  shadowWrapper.id = "root";
  shadowWrapper.style.display = "contents";
  shadowRoot.appendChild(shadowWrapper);

  createRoot(shadowWrapper).render(
    <StrictMode>
      <Provider store={proxyStore}>
        <Content />
      </Provider>
    </StrictMode>,
  );
});
