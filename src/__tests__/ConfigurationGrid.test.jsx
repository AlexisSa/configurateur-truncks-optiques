import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import ConfigurationGrid from "../components/ConfigurationGrid.jsx";

// Mock des fonctions
const mockHandleOptionChange = vi.fn();
const mockGetAvailableFiberModesForCurrentConfig = vi.fn(() => [
  "Monomode OS2",
  "Multimode OM3",
  "Multimode OM4",
]);

const mockSelectedOptions = {
  connecteurA: "",
  connecteurB: "",
  nombreFibres: "",
  modeFibre: "",
  typeCable: "",
  longueur: "",
  epanouissement: "",
  typeTest: "",
};

describe("ConfigurationGrid", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("rendu de tous les éléments de configuration", () => {
    render(
      <ConfigurationGrid
        selectedOptions={mockSelectedOptions}
        handleOptionChange={mockHandleOptionChange}
        getAvailableFiberModesForCurrentConfig={
          mockGetAvailableFiberModesForCurrentConfig
        }
      />
    );

    // Vérifier que tous les éléments de configuration sont présents
    expect(screen.getByText("Connecteur A")).toBeInTheDocument();
    expect(screen.getByText("Connecteur B")).toBeInTheDocument();
    expect(screen.getByText("Nombre de fibres")).toBeInTheDocument();
    expect(screen.getByText("Mode Fibre")).toBeInTheDocument();
    expect(screen.getByText("Type de câble")).toBeInTheDocument();
    expect(screen.getByText("Longueur en ml")).toBeInTheDocument();
    expect(screen.getByText("Épanouissement")).toBeInTheDocument();
    expect(screen.getByText("Type de test")).toBeInTheDocument();
  });

  test("interaction avec les selecteurs", async () => {
    const user = userEvent.setup();

    render(
      <ConfigurationGrid
        selectedOptions={mockSelectedOptions}
        handleOptionChange={mockHandleOptionChange}
        getAvailableFiberModesForCurrentConfig={
          mockGetAvailableFiberModesForCurrentConfig
        }
      />
    );

    // Tester l'interaction avec le connecteur A
    const connecteurASelect = screen.getByLabelText("Connecteur A");
    await user.selectOptions(connecteurASelect, "LC");

    expect(mockHandleOptionChange).toHaveBeenCalledWith("connecteurA", "LC");
  });

  test("affichage des options de mode fibre dynamiques", () => {
    render(
      <ConfigurationGrid
        selectedOptions={mockSelectedOptions}
        handleOptionChange={mockHandleOptionChange}
        getAvailableFiberModesForCurrentConfig={
          mockGetAvailableFiberModesForCurrentConfig
        }
      />
    );

    // Vérifier que la fonction est appelée
    expect(mockGetAvailableFiberModesForCurrentConfig).toHaveBeenCalled();

    // Vérifier que les options sont affichées
    const modeFibreSelect = screen.getByLabelText("Mode Fibre");
    expect(modeFibreSelect).toBeInTheDocument();
  });

  test("structure de la grille", () => {
    render(
      <ConfigurationGrid
        selectedOptions={mockSelectedOptions}
        handleOptionChange={mockHandleOptionChange}
        getAvailableFiberModesForCurrentConfig={
          mockGetAvailableFiberModesForCurrentConfig
        }
      />
    );

    // Vérifier que la grille est présente
    const grid = screen
      .getByText("Connecteur A")
      .closest(".configuration-grid");
    expect(grid).toBeInTheDocument();

    // Vérifier qu'il y a 8 éléments de configuration
    const configItems = screen.getAllByText(
      /Connecteur|Nombre|Mode|Type|Longueur|Épanouissement/
    );
    expect(configItems).toHaveLength(8);
  });
});
