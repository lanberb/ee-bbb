import { createRoot } from "react-dom/client";
import App from "../components/app/App.tsx";

const main = () => {
  const root = document.querySelector("#root");

  if (root == null) {
    throw new Error("Root Element could not be found.");
  }

  createRoot(root).render(<App />);
};

main();
