import React from "react";
import { createRoot } from "react-dom/client";
import Synth from "@waw/synth";

createRoot(document.getElementById("app")!).render(
  <div>
    <Synth />
  </div>
);
