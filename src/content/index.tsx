import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Content } from "./content";

const root = document.body;

const extRoot = document.createElement("div");

root.appendChild(extRoot);

createRoot(extRoot).render(
  <StrictMode>
    <Content />,
  </StrictMode>,
);
