export function injectShadowHost(id: string) {
  let root = document.getElementById(id);
  if (root) {
    const container = (root as any).shadowRoot?.getElementById(`${id}-container`);
    return { root, container };
  }
  root = document.createElement("div");
  root.id = id;
  root.style.all = "initial";
  root.style.position = "fixed";
  root.style.zIndex = "2147483647";
  root.style.top = "0";
  root.style.right = "0";
  document.documentElement.appendChild(root);

  const shadow = root.attachShadow({ mode: "open" });

  try {
    const tw = (window as any).__PM_TW_CSS__ as string | undefined;
    if (tw) {
      const styleEl = document.createElement("style");
      styleEl.textContent = tw;
      shadow.appendChild(styleEl);
    }
  } catch {}

  const container = document.createElement("div");
  container.id = `${id}-container`;
  container.style.position = "relative";
  shadow.appendChild(container);

  return { root, container };
}
