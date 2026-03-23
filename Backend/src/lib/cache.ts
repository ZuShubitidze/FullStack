import NodeCache from "node-cache";

// One central cache
export const myCache = new NodeCache({
  stdTTL: 300, // 5 minutes default
  checkperiod: 60, // Check for expired keys every 60s
  maxKeys: 100,
});
