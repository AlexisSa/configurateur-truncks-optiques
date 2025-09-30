import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Header from "../components/Header.jsx";

describe("Header", () => {
  test("rendu du composant Header avec le titre et la description", () => {
    render(<Header />);

    // Vérifier que le titre est présent
    expect(
      screen.getByText("Configurateur de truncks optiques")
    ).toBeInTheDocument();

    // Vérifier que la description est présente
    expect(
      screen.getByText(
        "Configurez votre trunck optique selon vos besoins spécifiques"
      )
    ).toBeInTheDocument();

    // Vérifier que l'image est présente
    const image = screen.getByAltText("Trunck optique");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src");
  });

  test("structure HTML correcte", () => {
    render(<Header />);

    // Vérifier que l'élément header est présent
    const headerElement = screen.getByRole("banner");
    expect(headerElement).toBeInTheDocument();

    // Vérifier que le h1 est présent
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
  });
});
