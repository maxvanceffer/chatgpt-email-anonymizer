import React from "react";
import { useApp } from "../context/AppContext";
import Tabs from "./Tabs";
import IssuesTab from "./IssuesTab";
import HistoryTab from "./HistoryTab";

import DismissedTab from "./DismissedTab";

const Modal: React.FC = () => {
  const { ui, setTab, closeModal } = useApp();

  return (
    <div className="fixed right-4 top-4 max-w-sm w-[560px] max-h-[750px] overflow-hidden">
      <div className="flex h-full flex-col rounded-lg bg-white shadow-xl ring-1 ring-black/5 mb-4">
        <div className="flex items-center justify-between border-b px-3 py-2">
          <h2 className="text-lg font-semibold">Prompt Monitoring</h2>
          <button
            className="rounded px-2 py-1 text-xs text-gray-600 hover:bg-gray-100"
            onClick={closeModal}
            aria-label="Close"
          >
          </button>
        </div>
        <Tabs
          active={ui.activeTab}
          onChange={(t) => setTab(t)}
          tabs={[
            { key: "issues", label: "Issues Found" },
            { key: "history", label: "History" },
            { key: "dismissed", label: "Dismissed" }
          ]}
        />
        <div className="flex-1 overflow-y-scroll px-2 max-h-[650px]">
          {ui.activeTab === "issues" && <IssuesTab />}
          {ui.activeTab === "history" && <HistoryTab />}
          {ui.activeTab === "dismissed" && <DismissedTab />}
        </div>
      </div>
    </div>
  );
};

export default Modal;
