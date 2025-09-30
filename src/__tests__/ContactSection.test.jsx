import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ContactSection from "../components/ContactSection.jsx";

describe("ContactSection", () => {
  test("rendu du composant avec les informations de contact", () => {
    render(<ContactSection />);

    // Vérifier que le titre est présent
    expect(screen.getByText("Nous contacter")).toBeInTheDocument();

    // Vérifier que les méthodes de contact sont présentes
    expect(screen.getByText("Téléphone")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Site web")).toBeInTheDocument();
  });

  test("affichage des informations de contact correctes", () => {
    render(<ContactSection />);

    // Vérifier les numéros de téléphone
    expect(screen.getByText("03.65.61.04.20")).toBeInTheDocument();
    expect(screen.getByText("02.53.35.60.40")).toBeInTheDocument();

    // Vérifier l'email
    expect(screen.getByText("info.xeilom@xeilom.fr")).toBeInTheDocument();

    // Vérifier le site web
    expect(screen.getByText("xeilom.fr")).toBeInTheDocument();
  });

  test("structure HTML correcte", () => {
    render(<ContactSection />);

    // Vérifier que la section contact est présente
    const contactSection = screen
      .getByText("Nous contacter")
      .closest(".contact-section");
    expect(contactSection).toBeInTheDocument();

    // Vérifier que la carte contact est présente
    const contactCard = contactSection.querySelector(".contact-card");
    expect(contactCard).toBeInTheDocument();

    // Vérifier que les méthodes de contact sont présentes
    const contactMethods = contactSection.querySelectorAll(".contact-method");
    expect(contactMethods).toHaveLength(3);
  });

  test("présence des icônes SVG", () => {
    render(<ContactSection />);

    // Vérifier que les icônes SVG sont présentes
    const svgElements = document.querySelectorAll("svg");
    expect(svgElements.length).toBeGreaterThan(0);
  });
});
