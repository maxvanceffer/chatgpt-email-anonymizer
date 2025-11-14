import { createRoot } from "react-dom/client";
import React from "react";
import App from "../ui/App";
import { injectShadowHost } from "../utils/dom";
// @ts-ignore
import twCss from "../styles/index.css?inline";

(function attachTwToGlobal() {
  (window as any).__PM_TW_CSS__ = twCss;
})();

(function injectInpage() {
  const id = "pm-inpage-script";
  if (document.getElementById(id)) return;
  const s = document.createElement("script");
  s.id = id;
  s.src = chrome.runtime.getURL("inpage.js");
  s.type = "text/javascript";
  (document.documentElement || document.head || document.body).appendChild(s);
})();

window.addEventListener("message", async (e: MessageEvent) => {
  const d: any = e.data;
  if (!d || d.source !== "PM_INPAGE" || d.type !== "CHECK_BODY" || typeof d.body !== "string") return;
  const reqId = d.reqId;

  try {
    const resp: any = await chrome.runtime.sendMessage({
      type: "SCAN_AND_ANON",
      payload: { text: d.body }
    });
    const anonymized = resp?.payload?.anonymized || d.body;

    const emails: string[] = resp?.payload?.emails || [];
    const sample = d.body.slice(0, 160);
    if (emails.length > 0) {
      window.postMessage(
        { source: "PM_CONTENT", type: "OPEN_MODAL", payload: { emails, sample } },
        "*"
      );
    }
    window.postMessage({ source: "PM_CONTENT", type: "CHECK_RESULT", reqId, anonymized }, "*");
  } catch {
    window.postMessage({ source: "PM_CONTENT", type: "CHECK_RESULT", reqId, anonymized: d.body }, "*");
  }
});

chrome.runtime.onMessage.addListener((msg, _sender, _sendResponse) => {
  if (!msg || msg.source !== "PM_BG" || msg.type !== "OPEN_MODAL_FROM_ACTION") return;
  window.postMessage(
    { source: "PM_CONTENT", type: "OPEN_MODAL", payload: { emails: [], sample: "" } },
    "*"
  );
});

(function () {
  const host = injectShadowHost("prompt-monitor-root");
  const root = createRoot(host.container);
  root.render(<App />);
})();
