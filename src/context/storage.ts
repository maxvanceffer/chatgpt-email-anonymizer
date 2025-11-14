export type IssueEntry = {
  id: string;
  emails: { email: string; dismissedUntil?: number }[];
  detectedAt: number;
};

export type PersistedState = {
  issues: IssueEntry[];
  dismissMap: Record<string, number | undefined>;
};

const KEY = "issue_state";

export async function loadState(): Promise<PersistedState> {
  const res = await chrome.storage.local.get(KEY);
  return (res[KEY] as PersistedState) || { issues: [], dismissMap: {} };
}

export async function saveState(state: PersistedState) {
  await chrome.storage.local.set({ [KEY]: state });
}
