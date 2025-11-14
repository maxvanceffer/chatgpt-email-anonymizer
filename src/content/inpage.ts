(() => {
  const g = window as any;
  if (g.__PM_INPAGE_INSTALLED__) return;
  g.__PM_INPAGE_INSTALLED__ = true;

  const nativeFetch = window.fetch.bind(window);
  const CHECK_TIMEOUT_MS = 800;

  function isConversation(u: string): boolean {
    try {
      const p = new URL(u, location.origin).pathname;
      return p.includes("/backend-api/f/conversation") || p.includes("/backend-api/conversation");
    } catch {
      return false;
    }
  }
  function bodyToStr(b: any): string {
    if (!b) return "";
    if (typeof b === "string") return b;
    try { return JSON.stringify(b); } catch { return ""; }
  }

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const method = (init?.method || (input instanceof Request ? input.method : "GET")).toUpperCase();
    const url = input instanceof Request ? input.url : String(input);

    if (method === "POST" && isConversation(url)) {
      let body = "";
      if (init?.body) body = bodyToStr(init.body);
      else if (input instanceof Request) {
        try { body = await input.clone().text(); } catch {}
      }

      if (body) {
        const reqId = Math.random().toString(36).slice(2);
        window.postMessage({ source: "PM_INPAGE", type: "CHECK_BODY", reqId, body }, "*");

        const anonymized = await new Promise<string>((resolve) => {
          const onMsg = (e: MessageEvent) => {
            const d = e.data || {};
            if (d && d.source === "PM_CONTENT" && d.type === "CHECK_RESULT" && d.reqId === reqId) {
              window.removeEventListener("message", onMsg);
              resolve(typeof d.anonymized === "string" ? d.anonymized : body);
            }
          };
          window.addEventListener("message", onMsg);
          setTimeout(() => {
            window.removeEventListener("message", onMsg);
            resolve(body);
          }, CHECK_TIMEOUT_MS);
        });

        if (anonymized !== body) {
          const headers = new Headers(init?.headers || (input instanceof Request ? input.headers : undefined));
          if (!headers.get("content-type")) headers.set("content-type", "application/json;charset=UTF-8");
          const newInit: RequestInit = { ...(init || {}), body: anonymized, headers };
          return nativeFetch(input, newInit);
        }
      }
    }
    return nativeFetch(input, init);
  };
})();
