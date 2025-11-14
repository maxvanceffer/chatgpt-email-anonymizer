import React from "react";
import { useApp } from "../context/AppContext";

const HistoryTab: React.FC = () => {
  const { issues } = useApp();

  if (issues.length === 0) {
    return <p className="text-sm text-gray-600 pb-4 text-center">No history yet.</p>;
  }

  return (
    <div>
      {issues.map((it) => (
        <div key={it.id} className="rounded border p-2">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              {new Date(it.detectedAt).toLocaleString()}
            </span>
          </div>
          <ul className="space-y-1">
            {it.emails.map((e) => {
              const dismissed = e.dismissedUntil && e.dismissedUntil > Date.now();
              return (
                <li key={e.email} className="flex items-center justify-between">
                  <span className="text-sm font-mono">{e.email}</span>
                  {dismissed && (
                    <span className="rounded bg-yellow-100 px-2 py-0.5 text-sm text-yellow-800">
                      Dismissed until {new Date(e.dismissedUntil!).toLocaleString()}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default HistoryTab;
