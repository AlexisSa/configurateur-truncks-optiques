import ConfigurationItem from "./ConfigurationItem.jsx";

const ConfigurationGrid = ({
  selectedOptions,
  handleOptionChange,
  getAvailableFiberModesForCurrentConfig,
  getFieldState,
}) => {
  return (
    <div className="configuration-grid">
      {/* Connecteur A */}
      <ConfigurationItem
        number="1"
        label="Connecteur A"
        state={getFieldState("connecteurA")}
      >
        <select
          aria-label="Connecteur A"
          value={selectedOptions.connecteurA || ""}
          onChange={(e) => handleOptionChange("connecteurA", e.target.value)}
        >
          <option value="">Sélectionner</option>
          <option value="LC">LC</option>
          <option value="SC">SC</option>
          <option value="ST">ST</option>
          <option value="SCA">SC/APC</option>
        </select>
      </ConfigurationItem>

      {/* Connecteur B */}
      <ConfigurationItem
        number="2"
        label="Connecteur B"
        state={getFieldState("connecteurB")}
      >
        <select
          aria-label="Connecteur B"
          value={selectedOptions.connecteurB || ""}
          onChange={(e) => handleOptionChange("connecteurB", e.target.value)}
        >
          <option value="">Sélectionner</option>
          <option value="LC">LC</option>
          <option value="SC">SC</option>
          <option value="ST">ST</option>
          <option value="SCA">SC/APC</option>
        </select>
      </ConfigurationItem>

      {/* Nombre de fibres */}
      <ConfigurationItem
        number="3"
        label="Nombre de fibres"
        state={getFieldState("nombreFibres")}
      >
        <select
          aria-label="Nombre de fibres"
          value={selectedOptions.nombreFibres || ""}
          onChange={(e) => handleOptionChange("nombreFibres", e.target.value)}
        >
          <option value="">Sélectionner</option>
          <option value="4">4 Fibres</option>
          <option value="6">6 Fibres</option>
          <option value="12">12 Fibres</option>
          <option value="24">24 Fibres</option>
          <option value="48">48 Fibres</option>
        </select>
      </ConfigurationItem>

      {/* Mode Fibre */}
      <ConfigurationItem
        number="4"
        label="Mode Fibre"
        state={getFieldState("modeFibre")}
      >
        <select
          aria-label="Mode Fibre"
          value={selectedOptions.modeFibre || ""}
          onChange={(e) => handleOptionChange("modeFibre", e.target.value)}
        >
          <option value="">Sélectionner</option>
          {getAvailableFiberModesForCurrentConfig().map((mode) => (
            <option key={mode} value={mode}>
              {mode}
            </option>
          ))}
        </select>
      </ConfigurationItem>

      {/* Type de câble */}
      <ConfigurationItem
        number="5"
        label="Type de câble"
        state={getFieldState("typeCable")}
      >
        <select
          aria-label="Type de câble"
          value={selectedOptions.typeCable || ""}
          onChange={(e) => handleOptionChange("typeCable", e.target.value)}
        >
          <option value="">Sélectionner</option>
          <option value="Standard LSZH">Standard LSZH</option>
          <option value="Renforcé LSZH">Renforcé LSZH</option>
          <option value="Standard PE">Standard PE</option>
          <option value="Armé Acier LSZH">Armé Acier LSZH</option>
          <option value="Armé Acier PE">Armé Acier PE</option>
        </select>
      </ConfigurationItem>

      {/* Longueur */}
      <ConfigurationItem
        number="6"
        label="Longueur en ml"
        state={getFieldState("longueur")}
      >
        <input
          aria-label="Longueur"
          type="number"
          value={selectedOptions.longueur || ""}
          onChange={(e) => handleOptionChange("longueur", e.target.value)}
          placeholder="Entrez la longueur"
          min="1"
          step="1"
        />
      </ConfigurationItem>

      {/* Épanouissement */}
      <ConfigurationItem
        number="7"
        label="Épanouissement"
        state={getFieldState("epanouissement")}
      >
        <select
          aria-label="Épanouissement"
          value={selectedOptions.epanouissement || ""}
          onChange={(e) => handleOptionChange("epanouissement", e.target.value)}
        >
          <option value="">Sélectionner</option>
          <option value="Regainé (2,8 mm)">Regainé (2,8 mm)</option>
          <option
            value="Standard (900 µm)"
            disabled={
              selectedOptions.typeCable === "Standard PE" ||
              selectedOptions.typeCable === "Armé Acier LSZH" ||
              selectedOptions.typeCable === "Armé Acier PE"
            }
          >
            Standard (900 µm)
            {(selectedOptions.typeCable === "Standard PE" ||
              selectedOptions.typeCable === "Armé Acier LSZH" ||
              selectedOptions.typeCable === "Armé Acier PE") &&
              " (Non disponible pour ce type de câble)"}
          </option>
        </select>
      </ConfigurationItem>

      {/* Type de test */}
      <ConfigurationItem
        number="8"
        label="Type de test"
        state={getFieldState("typeTest")}
      >
        <select
          aria-label="Type de test"
          value={selectedOptions.typeTest || ""}
          onChange={(e) => handleOptionChange("typeTest", e.target.value)}
        >
          <option value="">Sélectionner</option>
          <option value="Photométrie">Photométrie</option>
          <option value="Réflectométrie">Réflectométrie</option>
        </select>
      </ConfigurationItem>

      {/* Quantité */}
      <ConfigurationItem
        number="9"
        label="Quantité"
        state={getFieldState("quantite")}
      >
        <div className="quantity-selector">
          <button
            type="button"
            className="quantity-btn quantity-minus"
            onClick={() => {
              const currentValue = parseInt(selectedOptions.quantite) || 1;
              if (currentValue > 1) {
                handleOptionChange("quantite", (currentValue - 1).toString());
              }
            }}
            disabled={(parseInt(selectedOptions.quantite) || 1) <= 1}
            aria-label="Diminuer la quantité"
          >
            −
          </button>
          <input
            aria-label="Quantité"
            type="number"
            value={selectedOptions.quantite || "1"}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "") {
                // Permettre la valeur vide temporairement pour la saisie
                handleOptionChange("quantite", value);
              } else {
                const numValue = parseInt(value);
                if (numValue >= 1 && numValue <= 999) {
                  handleOptionChange("quantite", value);
                } else if (numValue < 1) {
                  // Forcer à 1 si la valeur est inférieure à 1
                  handleOptionChange("quantite", "1");
                }
              }
            }}
            onBlur={(e) => {
              // Si l'input est vide au blur, remettre la valeur par défaut
              if (e.target.value === "") {
                handleOptionChange("quantite", "1");
              }
            }}
            placeholder="1"
            min="1"
            max="999"
            step="1"
            className="quantity-input"
          />
          <button
            type="button"
            className="quantity-btn quantity-plus"
            onClick={() => {
              const currentValue = parseInt(selectedOptions.quantite) || 1;
              if (currentValue < 999) {
                handleOptionChange("quantite", (currentValue + 1).toString());
              }
            }}
            disabled={(parseInt(selectedOptions.quantite) || 1) >= 999}
            aria-label="Augmenter la quantité"
          >
            +
          </button>
        </div>
      </ConfigurationItem>
    </div>
  );
};

export default ConfigurationGrid;
