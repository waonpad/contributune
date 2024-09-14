import { createRoot } from "react-dom/client";
import { Content } from "./content";

const root = document.body;

const extRoot = document.createElement("div");

extRoot.style.display = "none";

extRoot.title = "Chrome拡張機能 Contributune によってページに挿入された要素です";

root.appendChild(extRoot);

// StrictModeを使用すると上手く動かない (???)
createRoot(extRoot).render(<Content />);
