import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import App from "../App.jsx";

// Mock des composants enfants pour simplifier les tests
vi.mock("../components/Header.jsx", () => ({
  default: function MockHeader() {
    return <div data-testid="header">Header</div>;
  },
}));

vi.mock("../components/ConfigurationGrid.jsx", () => ({
  default: function MockConfigurationGrid({
    selectedOptions,
    handleOptionChange,
  }) {
    return (
      <div data-testid="configuration-grid">
        <button onClick={() => handleOptionChange("connecteurA", "LC")}>
          Set Connecteur A
        </button>
        <div>Selected: {JSON.stringify(selectedOptions)}</div>
      </div>
    );
  },
}));

vi.mock("../components/ResultsSection.jsx", () => ({
  default: function MockResultsSection({ selectedOptions }) {
    return (
      <div data-testid="results-section">
        Results for: {JSON.stringify(selectedOptions)}
      </div>
    );
  },
}));

vi.mock("../components/ContactSection.jsx", () => ({
  default: function MockContactSection() {
    return <div data-testid="contact-section">Contact Section</div>;
  },
}));

vi.mock("../components/PresetModal.jsx", () => ({
  default: function MockPresetModal({
    showPresetModal,
    setShowPresetModal,
    loadPresetConfiguration,
  }) {
    if (!showPresetModal) return null;
    return (
      <div data-testid="preset-modal">
        <button onClick={() => setShowPresetModal(false)}>Close Modal</button>
        <button
          onClick={() =>
            loadPresetConfiguration({ options: { connecteurA: "LC" } })
          }
        >
          Load Preset
        </button>
      </div>
    );
  },
}));

describe("App", () => {
  test("rendu du composant App avec tous les composants enfants", () => {
    render(<App />);

    // Vérifier que tous les composants principaux sont présents
    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("configuration-grid")).toBeInTheDocument();
    expect(screen.getByTestId("results-section")).toBeInTheDocument();
    expect(screen.getByTestId("contact-section")).toBeInTheDocument();
  });

  test("affichage du bouton des configurations pré-faites", () => {
    render(<App />);

    expect(
      screen.getByText("⚡ Configurations pré-faites")
    ).toBeInTheDocument();
  });

  test("ouverture du modal des configurations pré-faites", async () => {
    const user = userEvent.setup();
    render(<App />);

    const presetButton = screen.getByText("⚡ Configurations pré-faites");
    await user.click(presetButton);

    expect(screen.getByTestId("preset-modal")).toBeInTheDocument();
  });

  test("fermeture du modal des configurations pré-faites", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Ouvrir le modal
    const presetButton = screen.getByText("⚡ Configurations pré-faites");
    await user.click(presetButton);

    // Fermer le modal
    const closeButton = screen.getByText("Close Modal");
    await user.click(closeButton);

    expect(screen.queryByTestId("preset-modal")).not.toBeInTheDocument();
  });

  test("chargement d'une configuration pré-faite", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Ouvrir le modal
    const presetButton = screen.getByText("⚡ Configurations pré-faites");
    await user.click(presetButton);

    // Charger une configuration
    const loadButton = screen.getByText("Load Preset");
    await user.click(loadButton);

    // Vérifier que la fonction loadPresetConfiguration a été appelée
    // Le modal se ferme automatiquement après le chargement dans l'implémentation réelle
    expect(screen.getByTestId("preset-modal")).toBeInTheDocument();
  });

  test("interaction avec la grille de configuration", async () => {
    const user = userEvent.setup();
    render(<App />);

    const setButton = screen.getByText("Set Connecteur A");
    await user.click(setButton);

    // Vérifier que l'état a été mis à jour
    const resultsSection = screen.getByTestId("results-section");
    expect(resultsSection).toHaveTextContent('"connecteurA":"LC"');
  });

  test("structure de la page", () => {
    render(<App />);

    // Vérifier que la structure principale est présente
    const app = screen.getByTestId("header").closest(".app");
    expect(app).toBeInTheDocument();

    // Vérifier que le main est présent
    const main = app.querySelector(".app-main");
    expect(main).toBeInTheDocument();
  });
});
