import React from "react";

const Tabs: React.FC<{
  active: "issues" | "history" | "dismissed";
  tabs: { key: "issues" | "history" | "dismissed"; label: string }[];
  onChange: (k: "issues" | "history" | "dismissed") => void;
}> = ({ active, tabs, onChange }) => {
  return (
    <div className="flex border-b px-2 mb-4">
      {tabs.map((t) => {
        const isActive = t.key === active;
        return (
          <button
            key={t.key}
            className={`-mb-px mr-2 rounded-t px-3 py-2 ${
              isActive
                ? "text-base border-b-2 border-blue-600 font-medium text-blue-700"
                : "text-base text-gray-600 hover:text-gray-800"
            }`}
            onClick={() => onChange(t.key)}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
