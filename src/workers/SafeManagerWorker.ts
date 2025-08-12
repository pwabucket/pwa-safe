import * as Comlink from "comlink";

import SafeManager from "../lib/SafeManager";

const safeManager = new SafeManager();

Comlink.expose(safeManager);
