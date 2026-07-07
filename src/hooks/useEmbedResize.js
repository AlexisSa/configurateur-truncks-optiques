import { useEffect } from "react";

const PARENT_ORIGIN = "https://www.xeilom.fr";

export function isEmbedMode() {
  return new URLSearchParams(window.location.search).get("embed") === "1";
}

export function sendEmbedHeight() {
  window.parent.postMessage(
    { type: "xeilom-resize", height: document.documentElement.scrollHeight },
    PARENT_ORIGIN
  );
}

export function useEmbedResize() {
  useEffect(() => {
    if (!isEmbedMode()) return;

    sendEmbedHeight();

    const resizeObserver = new ResizeObserver(() => {
      sendEmbedHeight();
    });

    resizeObserver.observe(document.body);

    window.addEventListener("resize", sendEmbedHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", sendEmbedHeight);
    };
  }, []);
}
