import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import {
  isEmbedMode,
  sendEmbedHeight,
} from "../hooks/useEmbedResize.js";

describe("useEmbedResize", () => {
  const postMessageMock = vi.fn();

  beforeEach(() => {
    postMessageMock.mockClear();
    window.parent.postMessage = postMessageMock;
    Object.defineProperty(document.documentElement, "scrollHeight", {
      configurable: true,
      value: 1200,
    });
  });

  afterEach(() => {
    window.history.replaceState({}, "", "/");
  });

  test("isEmbedMode retourne true avec ?embed=1", () => {
    window.history.replaceState({}, "", "/?embed=1");
    expect(isEmbedMode()).toBe(true);
  });

  test("isEmbedMode retourne false sans paramètre embed", () => {
    window.history.replaceState({}, "", "/");
    expect(isEmbedMode()).toBe(false);
  });

  test("sendEmbedHeight envoie la hauteur au parent xeilom", () => {
    sendEmbedHeight();

    expect(postMessageMock).toHaveBeenCalledWith(
      { type: "xeilom-resize", height: 1200 },
      "https://www.xeilom.fr"
    );
  });
});
