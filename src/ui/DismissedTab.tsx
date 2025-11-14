import React from "react";
import { useApp } from "../context/AppContext";

const DismissedTab: React.FC = () => {
  const { dismissMap, undismissEmails } = useApp();
  const now = Date.now();

  const entries = Object.entries(dismissMap)
    .filter(([_, until]) => typeof until === "number" && until! > now)
    .sort((a, b) => (a[1]! - b[1]!));

  if (entries.length === 0) {
    return <p className="text-sm text-gray-600 pb-4 text-center">No dismissed emails.</p>;
  }

  return (
    <div>
      <p className="mb-2 text-sm text-gray-700">
        These email addresses are currently dismissed and will not trigger alerts or anonymization until the time below.
      </p>
      <ul className="mb-3 space-y-2">
        {entries.map(([email, until]) => {
          const date = new Date(until!);
          return (
            <li key={email} className="flex items-center justify-between rounded border p-2">
              <div className="flex flex-col">
                <span className="text-sm font-mono text-sm">{email}</span>
                <span className="text-sm text-gray-500">
                  Dismissed until {date.toLocaleString()}
                </span>
              </div>
              <button
                className="rounded bg-gray-800 px-2 py-1 text-sm text-white hover:bg-gray-700"
                onClick={() => undismissEmails([email])}
              >
                Remove
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default DismissedTab;
