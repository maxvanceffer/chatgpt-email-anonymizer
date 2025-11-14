(() => {
    if (window.top !== window.self) return;

    const url = chrome.runtime.getURL("content.js");

    const inject = () => {
        const root = document.documentElement || document.head || document.body;
        if (!root) return setTimeout(inject, 10);
        if (document.querySelector('script[data-prompt-monitor="content"]')) return;

        const s = document.createElement("script");
        s.type = "text/javascript";
        s.src = url;
        s.setAttribute("data-prompt-monitor", "content");
        root.appendChild(s);
    };

    if (document.readyState === "loading") {
        const wait = () => (document.documentElement ? inject() : setTimeout(wait, 10));
        wait();
    } else {
        inject();
    }
})();