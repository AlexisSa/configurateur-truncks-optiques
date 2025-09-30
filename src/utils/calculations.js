import { TARIFS } from "./tarifs.js";

// Fonction pour vérifier si la configuration est complète
export const isConfigurationComplete = (selectedOptions) => {
  const requiredFields = [
    "connecteurA",
    "connecteurB",
    "nombreFibres",
    "modeFibre",
    "typeCable",
    "longueur",
    "epanouissement",
    "typeTest",
    "quantite",
  ];
  return requiredFields.every((field) => selectedOptions[field] !== "");
};

// Fonction pour obtenir les modes de fibre disponibles
export const getAvailableFiberModes = (selectedOptions) => {
  const allModes = [
    "Monomode OS2",
    "Multimode OM1",
    "Multimode OM2",
    "Multimode OM3",
    "Multimode OM4",
    "Multimode OM5",
  ];

  // Si SC/APC est sélectionné, seul Monomode OS2 est disponible
  if (
    selectedOptions.connecteurA === "SCA" ||
    selectedOptions.connecteurB === "SCA"
  ) {
    return ["Monomode OS2"];
  }

  return allModes;
};

// Fonction pour vérifier la disponibilité de la configuration
export const isConfigurationAvailable = (selectedOptions) => {
  if (!isConfigurationComplete(selectedOptions))
    return { available: false, reason: "Configuration incomplète" };

  // Vérifier si SC/APC est sélectionné
  if (
    selectedOptions.connecteurA === "SCA" ||
    selectedOptions.connecteurB === "SCA"
  ) {
    if (selectedOptions.modeFibre !== "Monomode OS2") {
      return {
        available: false,
        reason: "SC/APC n'est disponible qu'avec Monomode OS2",
      };
    }
  }

  // Tarifs des câbles par mètre linéaire selon la grille tarifaire
  const cablePrices = TARIFS.cablePrices;

  // Vérifier si le câble est disponible
  const cablePrice =
    cablePrices[selectedOptions.typeCable]?.[selectedOptions.modeFibre]?.[
      selectedOptions.nombreFibres
    ];
  if (cablePrice === null || cablePrice === undefined) {
    return {
      available: false,
      reason: `Configuration non disponible : ${selectedOptions.typeCable} ${selectedOptions.modeFibre} ${selectedOptions.nombreFibres} fibres`,
    };
  }

  // Les connecteurs sont maintenant inclus dans la main d'œuvre
  // Plus besoin de vérifier leur disponibilité

  return { available: true, reason: null };
};

// Fonction pour calculer le détail des prix
export const getPriceBreakdown = (selectedOptions) => {
  if (!isConfigurationComplete(selectedOptions)) return null;

  // Tarifs des câbles par mètre linéaire selon la grille tarifaire
  const cablePrices = TARIFS.cablePrices;

  // Main d'œuvre selon le type de câble et le nombre de fibres
  const laborCosts = TARIFS.laborCosts;
  
  // Déterminer le type de tarif de main d'œuvre
  const isStandardCable = selectedOptions.typeCable === "Standard LSZH" || selectedOptions.typeCable === "Renforcé LSZH";
  const laborType = isStandardCable ? "standard" : "other";

  // Coût de regainage selon le nombre de fibres
  const resheathingCosts = TARIFS.resheathingCosts;

  // Coût des tests
  const testCosts = TARIFS.testCosts;


  try {
    // 1. Prix du câble par mètre linéaire
    const nombreFibres = parseInt(selectedOptions.nombreFibres);
    const cablePricePerMeter =
      cablePrices[selectedOptions.typeCable]?.[selectedOptions.modeFibre]?.[
        nombreFibres
      ];
    const cableTotal =
      cablePricePerMeter * parseFloat(selectedOptions.longueur);

    // 2. Main d'œuvre (inclut les connecteurs)
    const laborTotal = laborCosts[laborType][nombreFibres];

    // 3. Coût de regainage (si épanouissement regainé)
    const resheathingTotal =
      selectedOptions.epanouissement === "Regainé (2,8 mm)"
        ? resheathingCosts[nombreFibres]
        : 0;

    // 4. Coût des tests
    const testTotal =
      selectedOptions.typeTest === "Réflectométrie"
        ? testCosts[selectedOptions.typeTest][nombreFibres]
        : testCosts[selectedOptions.typeTest];

    return {
      cable: {
        pricePerMeter: cablePricePerMeter,
        total: cableTotal,
        description: `Câble ${selectedOptions.typeCable} ${selectedOptions.modeFibre}`,
      },
      labor: {
        total: laborTotal,
        description: `Main d'œuvre (${laborType === "standard" ? "Standard/Renforcé LSZH" : "Autres types"})`,
      },
      resheathing: {
        total: resheathingTotal,
        description: "Regainage",
      },
      test: {
        total: testTotal,
        description: `Test ${selectedOptions.typeTest}`,
      },
      subtotal:
        cableTotal + laborTotal + resheathingTotal + testTotal,
      margin: {
        percentage: 50,
        amount:
          (cableTotal +
            laborTotal +
            resheathingTotal +
            testTotal) *
          1.0, // Marge de 50% = coût * 1.0 (car prix final = coût / 0.5)
        description: "Marge commerciale (50%)",
      },
      quantity: {
        value: parseInt(selectedOptions.quantite) || 1,
        description: "Quantité",
      },
      total:
        ((cableTotal +
          laborTotal +
          resheathingTotal +
          testTotal) /
          0.5) *
        (parseInt(selectedOptions.quantite) || 1),
    };
  } catch (error) {
    console.error("Erreur dans le calcul du détail des prix:", error);
    return null;
  }
};

// Fonction pour calculer le prix total
export const calculatePrice = (selectedOptions) => {
  if (!isConfigurationComplete(selectedOptions)) return null;

  // Tarifs des câbles par mètre linéaire selon la grille tarifaire
  const cablePrices = TARIFS.cablePrices;

  // Main d'œuvre selon le type de câble et le nombre de fibres
  const laborCosts = TARIFS.laborCosts;
  
  // Déterminer le type de tarif de main d'œuvre
  const isStandardCable = selectedOptions.typeCable === "Standard LSZH" || selectedOptions.typeCable === "Renforcé LSZH";
  const laborType = isStandardCable ? "standard" : "other";

  // Coût de regainage selon le nombre de fibres
  const resheathingCosts = TARIFS.resheathingCosts;

  // Coût des tests
  const testCosts = TARIFS.testCosts;


  try {
    // 1. Prix du câble par mètre linéaire
    const nombreFibres = parseInt(selectedOptions.nombreFibres);
    const cablePricePerMeter =
      cablePrices[selectedOptions.typeCable]?.[selectedOptions.modeFibre]?.[
        nombreFibres
      ];

    if (cablePricePerMeter === null || cablePricePerMeter === undefined) {
      return null; // Configuration non disponible
    }

    const cableTotal =
      cablePricePerMeter * parseFloat(selectedOptions.longueur);

    // 2. Main d'œuvre (inclut les connecteurs)
    const laborTotal = laborCosts[laborType][nombreFibres];

    // 3. Coût de regainage (si épanouissement regainé)
    const resheathingTotal =
      selectedOptions.epanouissement === "Regainé (2,8 mm)"
        ? resheathingCosts[nombreFibres]
        : 0;

    // 4. Coût des tests
    const testTotal =
      selectedOptions.typeTest === "Réflectométrie"
        ? testCosts[selectedOptions.typeTest][nombreFibres]
        : testCosts[selectedOptions.typeTest];

    // Calcul du prix total
    const totalPrice =
      cableTotal + laborTotal + resheathingTotal + testTotal;

    // Application de la marge de 50% (diviser par 0.5 = multiplier par 2)
    const priceWithMargin = totalPrice / 0.5;

    // Application de la quantité
    const quantity = parseInt(selectedOptions.quantite) || 1;
    const finalPrice = priceWithMargin * quantity;

    return Math.round(finalPrice * 100) / 100;
  } catch (error) {
    console.error("Erreur dans le calcul du prix:", error);
    return null;
  }
};

// Fonction pour générer la référence
export const generateReference = (selectedOptions) => {
  if (!isConfigurationComplete(selectedOptions)) return null;

  const refParts = [];
  const cableStructure = [];
  cableStructure.push("T");
  const fiberCount = selectedOptions.nombreFibres;
  cableStructure.push(fiberCount);
  const cableCode = {
    "Standard LSZH": "SD0H",
    "Renforcé LSZH": "RF0H",
    "Standard PE": "SLPE",
    "Armé Acier LSZH": "AA0H",
    "Armé Acier PE": "AAPE",
  };
  cableStructure.push(cableCode[selectedOptions.typeCable]);
  refParts.push(cableStructure.join(""));

  const testConnectors = [];
  const modeCodeMap = {
    "Monomode OS2": "OS2",
    "Multimode OM1": "M1",
    "Multimode OM2": "M2",
    "Multimode OM3": "M3",
    "Multimode OM4": "M4",
    "Multimode OM5": "M5",
  };
  const modeCode = modeCodeMap[selectedOptions.modeFibre];
  testConnectors.push(modeCode);

  const connectorA = selectedOptions.connecteurA;
  const connectorB = selectedOptions.connecteurB;
  testConnectors.push(`${connectorA}/${connectorB}`);

  testConnectors.push(selectedOptions.longueur);

  const testCode = selectedOptions.typeTest === "Photométrie" ? "P" : "R";
  testConnectors.push(testCode);

  refParts.push(testConnectors.join(""));

  return refParts.join("-");
};
