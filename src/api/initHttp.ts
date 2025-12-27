import { useEffect } from "react";
import { syncHttpBaseUrl } from "./http"

// set initial base URL at startup
syncHttpBaseUrl();

// listen for backend switches
window.addEventListener("opsboard:backend-changed", syncHttpBaseUrl);