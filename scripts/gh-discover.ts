/* eslint-disable no-console */
import { startDiscovery } from "../src/lib/discovery.ts";

console.info(`Discovery began`);

const duration = await startDiscovery();

console.info(`saved everything in ${duration / 1000}s`);
