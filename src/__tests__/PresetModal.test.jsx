import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import PresetModal from "../components/PresetModal.jsx";

// Mock des fonctions
const mockSetShowPresetModal = vi.fn();
const mockLoadPresetConfiguration = vi.fn();

describe("PresetModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("ne rend rien quand showPresetModal est false", () => {
    render(
      <PresetModal
        showPresetModal={false}
        setShowPresetModal={mockSetShowPresetModal}
        loadPresetConfiguration={mockLoadPresetConfiguration}
      />
    );

    expect(
      screen.queryByText("Configurations pré-faites")
    ).not.toBeInTheDocument();
  });

  test("rendu du modal avec les configurations pré-faites", () => {
    render(
      <PresetModal
        showPresetModal={true}
        setShowPresetModal={mockSetShowPresetModal}
        loadPresetConfiguration={mockLoadPresetConfiguration}
      />
    );

    // Vérifier que le titre est présent
    expect(screen.getByText("Configurations pré-faites")).toBeInTheDocument();

    // Vérifier que les configurations sont présentes
    expect(screen.getByText("Configuration Standard")).toBeInTheDocument();
    expect(screen.getByText("Configuration Renforcée")).toBeInTheDocument();
    expect(
      screen.getByText("Configuration Haute Performance")
    ).toBeInTheDocument();
  });

  test("fermeture du modal en cliquant sur l'overlay", async () => {
    const user = userEvent.setup();

    render(
      <PresetModal
        showPresetModal={true}
        setShowPresetModal={mockSetShowPresetModal}
        loadPresetConfiguration={mockLoadPresetConfiguration}
      />
    );

    const overlay = screen
      .getByText("Configurations pré-faites")
      .closest(".modal-overlay");
    await user.click(overlay);

    expect(mockSetShowPresetModal).toHaveBeenCalledWith(false);
  });

  test("fermeture du modal en cliquant sur le bouton de fermeture", async () => {
    const user = userEvent.setup();

    render(
      <PresetModal
        showPresetModal={true}
        setShowPresetModal={mockSetShowPresetModal}
        loadPresetConfiguration={mockLoadPresetConfiguration}
      />
    );

    const closeButton = screen.getByRole("button", { name: /✕/ });
    await user.click(closeButton);

    expect(mockSetShowPresetModal).toHaveBeenCalledWith(false);
  });

  test("chargement d'une configuration pré-faite", async () => {
    const user = userEvent.setup();

    render(
      <PresetModal
        showPresetModal={true}
        setShowPresetModal={mockSetShowPresetModal}
        loadPresetConfiguration={mockLoadPresetConfiguration}
      />
    );

    const loadButtons = screen.getAllByText("Charger cette configuration");
    await user.click(loadButtons[0]); // Cliquer sur le premier bouton

    expect(mockLoadPresetConfiguration).toHaveBeenCalled();
    expect(mockSetShowPresetModal).toHaveBeenCalledWith(false);
  });

  test("affichage des détails des configurations", () => {
    render(
      <PresetModal
        showPresetModal={true}
        setShowPresetModal={mockSetShowPresetModal}
        loadPresetConfiguration={mockLoadPresetConfiguration}
      />
    );

    // Vérifier que les descriptions sont présentes
    expect(
      screen.getByText(/Trunck optique standard pour usage général/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Trunck optique renforcé pour environnements difficiles/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Trunck optique haute performance pour applications critiques/
      )
    ).toBeInTheDocument();
  });
});
