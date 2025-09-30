import { renderHook, act } from "@testing-library/react";
import { vi } from "vitest";
import { useConfiguration } from "../hooks/useConfiguration.js";

// Mock des fonctions utilitaires
vi.mock("../utils/calculations.js", () => ({
  getAvailableFiberModes: vi.fn(() => [
    "Monomode OS2",
    "Multimode OM3",
    "Multimode OM4",
  ]),
}));

describe("useConfiguration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("initialise avec un état vide", () => {
    const { result } = renderHook(() => useConfiguration());

    expect(result.current.selectedOptions).toEqual({
      connecteurA: "",
      connecteurB: "",
      nombreFibres: "",
      modeFibre: "",
      typeCable: "",
      longueur: "",
      epanouissement: "",
      typeTest: "",
    });
  });

  test("handleOptionChange met à jour l'état correctement", () => {
    const { result } = renderHook(() => useConfiguration());

    act(() => {
      result.current.handleOptionChange("connecteurA", "LC");
    });

    expect(result.current.selectedOptions.connecteurA).toBe("LC");
  });

  test("handleOptionChange force Monomode OS2 quand SC/APC est sélectionné", () => {
    const { result } = renderHook(() => useConfiguration());

    act(() => {
      result.current.handleOptionChange("connecteurA", "SCA");
    });

    expect(result.current.selectedOptions.connecteurA).toBe("SCA");
    expect(result.current.selectedOptions.modeFibre).toBe("Monomode OS2");
  });

  test("handleOptionChange force Monomode OS2 quand le mode fibre change avec SC/APC", () => {
    const { result } = renderHook(() => useConfiguration());

    // D'abord, sélectionner SC/APC
    act(() => {
      result.current.handleOptionChange("connecteurA", "SCA");
    });

    // Ensuite, essayer de changer le mode fibre
    act(() => {
      result.current.handleOptionChange("modeFibre", "Multimode OM3");
    });

    expect(result.current.selectedOptions.modeFibre).toBe("Monomode OS2");
  });

  test("loadPresetConfiguration charge une configuration pré-faite", () => {
    const { result } = renderHook(() => useConfiguration());

    const preset = {
      options: {
        connecteurA: "LC",
        connecteurB: "SC",
        nombreFibres: "12",
        modeFibre: "Monomode OS2",
        typeCable: "Standard LSZH",
        longueur: "100",
        epanouissement: "Standard (900 µm)",
        typeTest: "Photométrie",
      },
    };

    act(() => {
      result.current.loadPresetConfiguration(preset);
    });

    expect(result.current.selectedOptions).toEqual(preset.options);
  });

  test("getAvailableFiberModesForCurrentConfig appelle la fonction utilitaire", () => {
    const { result } = renderHook(() => useConfiguration());

    const modes = result.current.getAvailableFiberModesForCurrentConfig();

    expect(modes).toEqual(["Monomode OS2", "Multimode OM3", "Multimode OM4"]);
  });

  test("mise à jour de plusieurs options", () => {
    const { result } = renderHook(() => useConfiguration());

    act(() => {
      result.current.handleOptionChange("connecteurA", "LC");
      result.current.handleOptionChange("connecteurB", "SC");
      result.current.handleOptionChange("nombreFibres", "12");
    });

    expect(result.current.selectedOptions.connecteurA).toBe("LC");
    expect(result.current.selectedOptions.connecteurB).toBe("SC");
    expect(result.current.selectedOptions.nombreFibres).toBe("12");
  });
});
