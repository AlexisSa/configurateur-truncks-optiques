import { useEffect } from "react";

const PARENT_ORIGIN = "https://www.xeilom.fr";
const RETRY_INTERVAL_MS = 400;
const RETRY_DURATION_MS = 10000;

export function isEmbedMode() {
  return new URLSearchParams(window.location.search).get("embed") === "1";
}

export function getPageHeight() {
  return Math.max(
    document.documentElement.scrollHeight,
    document.body.scrollHeight,
    document.documentElement.offsetHeight
  );
}

export function sendEmbedHeight() {
  window.parent.postMessage(
    { type: "xeilom-resize", height: getPageHeight() },
    PARENT_ORIGIN
  );
}

export function useEmbedResize() {
  useEffect(() => {
    if (!isEmbedMode()) return;

    document.documentElement.classList.add("embed-mode");

    const notifyParent = () => {
      requestAnimationFrame(sendEmbedHeight);
    };

    notifyParent();

    const retryInterval = window.setInterval(
      notifyParent,
      RETRY_INTERVAL_MS
    );
    const stopRetry = window.setTimeout(() => {
      window.clearInterval(retryInterval);
    }, RETRY_DURATION_MS);

    const resizeObserver = new ResizeObserver(notifyParent);
    resizeObserver.observe(document.body);
    resizeObserver.observe(document.documentElement);

    const mutationObserver = new MutationObserver(notifyParent);
    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    window.addEventListener("resize", notifyParent);
    window.addEventListener("load", notifyParent);

    return () => {
      document.documentElement.classList.remove("embed-mode");
      window.clearInterval(retryInterval);
      window.clearTimeout(stopRetry);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener("resize", notifyParent);
      window.removeEventListener("load", notifyParent);
    };
  }, []);
}
