import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { IssueEntry, PersistedState } from "./storage";
import { loadState, saveState } from "./storage";

type UIState = {
  modalOpen: boolean;
  activeTab: "issues" | "history" | "dismissed";
  currentEmails: string[];
  currentPromptSample?: string;
};

type Ctx = {
  ui: UIState;
  issues: IssueEntry[];
  dismissMap: Record<string, number | undefined>;
  openModal: (emails: string[], promptSample?: string) => void;
  closeModal: () => void;
  setTab: (tab: UIState["activeTab"]) => void;
  addIssue: (emails: string[], promptSample?: string) => Promise<void>;
  dismissEmails: (emails: string[], hours: number) => Promise<void>;
  undismissEmails: (emails: string[]) => Promise<void>;
  reload: () => Promise<void>;
};

const AppContext = createContext<Ctx | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [issues, setIssues] = useState<IssueEntry[]>([]);
  const [dismissMap, setDismissMap] = useState<Record<string, number | undefined>>({});
  const [ui, setUi] = useState<UIState>({
    modalOpen: false,
    activeTab: "issues",
    currentEmails: []
  });

  async function reload() {
    const s = await loadState();
    setIssues(s.issues);
    setDismissMap(s.dismissMap);
  }

  useEffect(() => {
  let mounted = true;
  (async () => { if (mounted) await reload(); })();
  const listener = (changes: any, areaName: any) => {
    if (areaName !== "local") return;
    if (changes["promptmon_state_v1"]) reload();
  };
  chrome.storage.onChanged.addListener(listener);
  return () => { mounted = false; chrome.storage.onChanged.removeListener(listener); };
}, []);

  function openModal(emails: string[], promptSample?: string) {
    setUi((u) => ({
      ...u,
      modalOpen: true,
      activeTab: "issues",
      currentEmails: emails,
      currentPromptSample: promptSample
    }));
  }

  function closeModal() {
    setUi((u) => ({ ...u, modalOpen: false }));
  }

  function setTab(tab: UIState["activeTab"]) {
    setUi((u) => ({ ...u, activeTab: tab }));
  }

  async function addIssue(emails: string[], promptSample?: string) {
    if (emails.length === 0) return;
    const entry: IssueEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      emails: emails.map((e) => ({ email: e, dismissedUntil: dismissMap[e] })),
      detectedAt: Date.now()
    };
    const next: PersistedState = {
      issues: [entry, ...issues].slice(0, 500),
      dismissMap
    };
    await saveState(next);
    await reload();
  }

  async function dismissEmails(emails: string[], hours: number) {
    const until = Date.now() + hours * 3600_000;
    const nextMap = { ...dismissMap };
    emails.forEach((e) => {
      nextMap[e.toLowerCase()] = until;
    });
    await saveState({ issues, dismissMap: nextMap });
    await reload();
  }

  async function undismissEmails(emails: string[]) {
    const nextMap = { ...dismissMap };
    emails.forEach((e) => {
      delete nextMap[e.toLowerCase()];
    });
    await saveState({ issues, dismissMap: nextMap });
    await reload();
  }

  const value: Ctx = useMemo(
    () => ({
      ui,
      issues,
      dismissMap,
      openModal,
      closeModal,
      setTab,
      addIssue,
      dismissEmails,
      undismissEmails,
      reload
    }),
    [ui, issues, dismissMap]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("Cannot mount the app");
  return ctx;
}
