import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import ResultsSection from "../components/ResultsSection.jsx";

// Mock des fonctions utilitaires
vi.mock("../utils/calculations.js", () => ({
  calculatePrice: vi.fn(),
  generateReference: vi.fn(),
  isConfigurationAvailable: vi.fn(),
  getPriceBreakdown: vi.fn(),
  isConfigurationComplete: vi.fn(),
}));

vi.mock("../utils/pdfGenerator.js", () => ({
  generatePdfPreview: vi.fn(),
  exportToPDF: vi.fn(),
}));

import {
  calculatePrice,
  generateReference,
  isConfigurationAvailable,
  getPriceBreakdown,
  isConfigurationComplete,
} from "../utils/calculations.js";

import { generatePdfPreview, exportToPDF } from "../utils/pdfGenerator.js";

describe("ResultsSection", () => {
  const mockSelectedOptions = {
    connecteurA: "LC",
    connecteurB: "SC",
    nombreFibres: "12",
    modeFibre: "Monomode OS2",
    typeCable: "Standard LSZH",
    longueur: "100",
    epanouissement: "Standard (900 µm)",
    typeTest: "Photométrie",
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Configuration par défaut des mocks
    calculatePrice.mockReturnValue(150.5);
    generateReference.mockReturnValue("T12SD0H-OS2-LC/SC-100-P");
    isConfigurationAvailable.mockReturnValue({ available: true, reason: null });
    getPriceBreakdown.mockReturnValue({
      cable: {
        total: 50,
        pricePerMeter: 0.5,
        description: "Câble Standard LSZH Monomode OS2",
      },
      connectors: {
        total: 30,
        priceA: 5,
        priceB: 4,
        description: "Connecteurs LC/SC",
      },
      labor: { total: 40, description: "Main d'œuvre" },
      resheathing: { total: 0, description: "Regainage" },
      test: { total: 0, description: "Test Photométrie" },
      strands: { total: 30.5, description: "Brins d'épanouissement" },
      total: 150.5,
    });
    isConfigurationComplete.mockReturnValue(true);
    generatePdfPreview.mockResolvedValue("data:image/png;base64,mock");
    exportToPDF.mockResolvedValue();
  });

  test("rendu du composant avec configuration complète", () => {
    render(<ResultsSection selectedOptions={mockSelectedOptions} />);

    // Vérifier que le titre est présent
    expect(
      screen.getByText("Résultats de votre configuration")
    ).toBeInTheDocument();

    // Vérifier que les éléments de résultat sont présents
    expect(screen.getByText("Référence à commander")).toBeInTheDocument();
    expect(screen.getByText("Prix d'achat")).toBeInTheDocument();
    expect(screen.getByText("Délai de fabrication")).toBeInTheDocument();
  });

  test("affichage de la référence générée", () => {
    render(<ResultsSection selectedOptions={mockSelectedOptions} />);

    expect(screen.getByText("T12SD0H-OS2-LC/SC-100-P")).toBeInTheDocument();
  });

  test("affichage du prix calculé", () => {
    render(<ResultsSection selectedOptions={mockSelectedOptions} />);

    expect(screen.getByText("150.5 €")).toBeInTheDocument();
  });

  test("affichage du délai de fabrication", () => {
    render(<ResultsSection selectedOptions={mockSelectedOptions} />);

    expect(screen.getByText("Environ 1 semaine")).toBeInTheDocument();
  });

  test("affichage du détail des prix", async () => {
    const user = userEvent.setup();

    render(<ResultsSection selectedOptions={mockSelectedOptions} />);

    // Cliquer sur le bouton pour afficher le détail
    const detailButton = screen.getByTitle("Voir le détail");
    await user.click(detailButton);

    // Vérifier que le détail est affiché
    expect(
      screen.getByText("Câble Standard LSZH Monomode OS2")
    ).toBeInTheDocument();
    expect(screen.getByText("Connecteurs LC/SC")).toBeInTheDocument();
    expect(screen.getByText("Main d'œuvre")).toBeInTheDocument();
  });

  test("affichage du résumé de configuration", () => {
    render(<ResultsSection selectedOptions={mockSelectedOptions} />);

    expect(
      screen.getByText(/Trunck : LC\/SC 12 Fibres Monomode OS2/)
    ).toBeInTheDocument();
  });

  test("boutons d'export PDF", () => {
    render(<ResultsSection selectedOptions={mockSelectedOptions} />);

    expect(screen.getByText("👁️ Prévisualiser")).toBeInTheDocument();
    expect(screen.getByText("📄 Exporter en PDF")).toBeInTheDocument();
  });

  test("gestion des erreurs de configuration", () => {
    isConfigurationAvailable.mockReturnValue({
      available: false,
      reason: "Configuration non disponible",
    });

    render(<ResultsSection selectedOptions={mockSelectedOptions} />);

    // Vérifier que la fonction isConfigurationAvailable a été appelée
    expect(isConfigurationAvailable).toHaveBeenCalledWith(mockSelectedOptions);
  });

  test("configuration incomplète", () => {
    isConfigurationComplete.mockReturnValue(false);
    calculatePrice.mockReturnValue(null);
    generateReference.mockReturnValue(null);

    render(<ResultsSection selectedOptions={mockSelectedOptions} />);

    const incompleteElements = screen.getAllByText(
      "Complétez la configuration"
    );
    expect(incompleteElements.length).toBeGreaterThan(0);
  });
});
