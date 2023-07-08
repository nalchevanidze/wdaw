import React from "react";
import { createRoot } from "react-dom/client";
import Synth from "@waw/synth";
import Player from "@waw/player";

const urlParams = new URLSearchParams(window.location.search);
const type = urlParams.get("type");

createRoot(document.getElementById("app")!).render(
  <div>
    {type === "player" ? (
      <Player src="https://nalchevanidze.com/assets/audio/david-alpha-black-hole" />
    ) : (
      <Synth />
    )}
  </div>
);
