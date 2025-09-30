import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ConfigurationItem from "../components/ConfigurationItem.jsx";

describe("ConfigurationItem", () => {
  test("rendu du composant avec les props correctes", () => {
    const mockProps = {
      number: "1",
      label: "Connecteur A",
      children: (
        <select>
          <option>Test</option>
        </select>
      ),
    };

    render(<ConfigurationItem {...mockProps} />);

    // Vérifier que le numéro est présent
    expect(screen.getByText("1")).toBeInTheDocument();

    // Vérifier que le label est présent
    expect(screen.getByText("Connecteur A")).toBeInTheDocument();

    // Vérifier que les enfants sont rendus
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  test("structure HTML correcte", () => {
    const mockProps = {
      number: "2",
      label: "Test Label",
      children: <input type="text" />,
    };

    render(<ConfigurationItem {...mockProps} />);

    // Vérifier que la structure est correcte
    const configItem = screen.getByRole("textbox").closest(".config-item");
    expect(configItem).toBeInTheDocument();

    // Vérifier que le header est présent
    const configHeader = configItem.querySelector(".config-header");
    expect(configHeader).toBeInTheDocument();

    // Vérifier que la valeur est présente
    const configValue = configItem.querySelector(".config-value");
    expect(configValue).toBeInTheDocument();
  });

  test("rendu avec différents types d'enfants", () => {
    const { rerender } = render(
      <ConfigurationItem number="1" label="Test">
        <input type="number" />
      </ConfigurationItem>
    );

    expect(screen.getByRole("spinbutton")).toBeInTheDocument();

    rerender(
      <ConfigurationItem number="2" label="Test">
        <button>Click me</button>
      </ConfigurationItem>
    );

    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});
