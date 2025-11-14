import React from "react";
import { useApp } from "../context/AppContext";

const IssuesTab: React.FC = () => {
  const { ui, dismissMap, dismissEmails, closeModal, addIssue } = useApp();
  const now = Date.now();
  const active = ui.currentEmails.filter((e) => {
    const until = dismissMap[e.toLowerCase()];
    return !(until && until > now);
  });

  return (
    <div className="pb-4">
      {active.length === 0 ? (
        <p className="text-sm text-gray-600 pb-4 text-center">No active issues.</p>
      ) : (
        <>
          <p className="mb-2 text-sm text-gray-700">
            Detected email addresses in your prompt. They were anonymized before sending.
          </p>
          <ul className="mb-3 space-y-2">
            {active.map((e) => (
              <li key={e} className="flex items-center justify-between rounded border p-2">
                <span className="text-sm font-mono">{e}</span>
                <button
                  className="rounded bg-gray-800 px-2 py-1 text-white hover:bg-gray-700"
                  onClick={() => dismissEmails([e], 24)}
                >
                  Dismiss 24h
                </button>
              </li>
            ))}
          </ul>
          <div className="flex gap-2">
            <button
              className="rounded bg-blue-600 px-3 py-2 text-white hover:bg-blue-500"
              onClick={() => {
                addIssue(active, ui.currentPromptSample);
                closeModal();
              }}
            >
              OK
            </button>
            <button
              className="rounded px-3 py-2 text-gray-700 hover:bg-gray-100"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default IssuesTab;
