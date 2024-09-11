import { createRoot } from "react-dom/client";
import { Content } from "./content";

const root = document.body;

const extRoot = document.createElement("div");

extRoot.style.display = "none";

root.appendChild(extRoot);

// StrictModeを使用すると上手く動かない (???)
createRoot(extRoot).render(<Content />);
