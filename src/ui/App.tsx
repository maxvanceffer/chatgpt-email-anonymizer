import React, { useEffect } from "react";
import { AppProvider, useApp } from "../context/AppContext";
import Modal from "./Modal";

const Gate: React.FC = () => {
  const { ui, openModal, setTab } = useApp();

  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      const d: any = e.data;
      if (!d || d.source !== "PM_CONTENT" || d.type !== "OPEN_MODAL") return;
      const emails: string[] = d.payload?.emails || [];
      const sample: string | undefined = d.payload?.sample;
      openModal(emails, sample);
      if (emails.length === 0) setTab("history");
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [openModal, setTab]);

  return ui.modalOpen ? <Modal /> : null;
};

const App: React.FC = () => (
  <AppProvider>
    <Gate />
  </AppProvider>
);

export default App;
