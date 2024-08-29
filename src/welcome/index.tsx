import "../global.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Welcome } from "./welcome";

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <Welcome />
  </StrictMode>,
);
