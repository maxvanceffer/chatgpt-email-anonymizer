import { scanEmails, anonymizeEmails } from "../utils/email";
import { loadState, saveState } from "../context/storage";
import type { PersistedState } from "../context/storage";
import type { BgRequest, BgResponse } from "../utils/messaging";

let cachedState: PersistedState | null = null;

async function getState(): Promise<PersistedState> {
  if (cachedState) return cachedState;
  cachedState = await loadState();
  return cachedState;
}

async function setState(next: PersistedState) {
  cachedState = next;
  await saveState(next);
}

chrome.runtime.onMessage.addListener((message: BgRequest, sender, sendResponse) => {
  (async () => {
    try {
      const state = await getState();

      if (message.type === "SCAN_AND_ANON") {
        const text = message.payload.text || "";

        const emails = scanEmails(text);
        if (emails.length === 0) {
          sendResponse({
            type: "SCAN_AND_ANON_RESULT",
            payload: { emails: [], anonymized: text }
          });
          return;
        }

        const now = Date.now();
        const active: string[] = [];
        for (let i = 0; i < emails.length; i++) {
          const e = emails[i];
          const until = state.dismissMap[e.toLowerCase()];
          if (!(until && until > now)) {
            active.push(e);
          }
        }

        const anonymized = anonymizeEmails(text, active);

        if (active.length > 0) {
          const entry = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            emails: active.map((e) => ({ email: e, dismissedUntil: state.dismissMap[e] })),
            detectedAt: Date.now()
          };
          const next: PersistedState = {
            issues: [entry, ...state.issues].slice(0, 500),
            dismissMap: state.dismissMap
          };
          await setState(next);
        }

        const resp: BgResponse = {
          type: "SCAN_AND_ANON_RESULT",
          payload: { emails: active, anonymized }
        };
        sendResponse(resp);
        return;
      }

      if (message.type === "GET_STATE") {
        sendResponse({ type: "STATE", payload: state } as BgResponse);
        return;
      }

      if (message.type === "DISMISS_EMAILS") {
        const { emails, hours } = message.payload;
        const until = Date.now() + hours * 3600_000;
        const next: PersistedState = {
          issues: state.issues,
          dismissMap: { ...state.dismissMap }
        };

        for (let i = 0; i < emails.length; i++) {
          const e = emails[i];
          next.dismissMap[e.toLowerCase()] = until;
        }

        await setState(next);
        sendResponse({ type: "ACK" } as BgResponse);
        return;
      }

      sendResponse({ type: "ACK" } as BgResponse);
    } catch (e) {
      sendResponse({ type: "ACK" } as BgResponse);
    }
  })();
  return true;
});
