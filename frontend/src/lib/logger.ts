const isProd = process.env.NODE_ENV === 'production';
const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
const LOG_ENDPOINT = apiUrl ? `${apiUrl}/api/logs` : '';

function safeStringify(v: any) {
  try {
    return typeof v === 'string' ? v : JSON.stringify(v);
  } catch {
    return String(v);
  }
}

export const logger = {
  error: (msg: any, ...args: any[]) => {
    try {
      if (isProd) {
        // In production, prefer to send to remote endpoint if configured. Otherwise no-op.
        if (LOG_ENDPOINT) {
          try {
            const payload = {
              level: 'error',
              message: safeStringify(msg),
              meta: args.map(safeStringify),
              ts: new Date().toISOString(),
            };
            if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
              navigator.sendBeacon(LOG_ENDPOINT, JSON.stringify(payload));
            } else {
              // fire-and-forget
              fetch(LOG_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }).catch(() => {});
            }
          } catch {
            // swallow
          }
        }
        return;
      }

      // In development, forward to console for visibility
      // eslint-disable-next-line no-console
      console.error(msg, ...args);
    } catch {
      // swallow
    }
  },
  warn: (msg: any, ...args: any[]) => {
    try {
      if (!isProd) {
        // eslint-disable-next-line no-console
        console.warn(msg, ...args);
      }
    } catch {}
  },
  info: (msg: any, ...args: any[]) => {
    try {
      if (!isProd) {
        // eslint-disable-next-line no-console
        console.info(msg, ...args);
      }
    } catch {}
  },
  debug: (msg: any, ...args: any[]) => {
    try {
      if (!isProd) {
        // eslint-disable-next-line no-console
        console.log(msg, ...args);
      }
    } catch {}
  }
};
