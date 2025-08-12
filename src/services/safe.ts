import * as Comlink from "comlink";

import type SafeManager from "../lib/SafeManager";
import SafeManagerWorker from "../workers/SafeManagerWorker?worker";

const worker = new SafeManagerWorker();
const safe = Comlink.wrap<InstanceType<typeof SafeManager>>(worker);

export default safe;
