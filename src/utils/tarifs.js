// Tarifs centralisés - source unique de vérité
export const TARIFS = {
  // Tarifs des câbles par mètre linéaire selon la grille tarifaire
  cablePrices: {
    // Câble intérieur/extérieur classique 900µm structure serrée LSZH-anti UV
    "Standard LSZH": {
      "Monomode OS2": {
        4: 0.46,
        6: 0.51,
        12: 0.79,
        24: 1.34,
        48: 2.45,
      },
      "Multimode OM1": {
        4: 0.71,
        6: 0.71,
        12: 1.34,
        24: null, // Pas disponible
        48: null, // Pas disponible
      },
      "Multimode OM2": {
        4: 0.64,
        6: 0.64,
        12: 1.01,
        24: null, // Pas disponible
        48: null, // Pas disponible
      },
      "Multimode OM3": {
        4: 0.55,
        6: 0.75,
        12: 1.2,
        24: 2.29,
        48: 4.98,
      },
      "Multimode OM4": {
        4: 0.9,
        6: 1.04,
        12: 1.81,
        24: 3.43,
        48: 7.33,
      },
      "Multimode OM5": {
        4: 2.13,
        6: 2.13,
        12: 4.01,
        24: null,
        48: null,
      },
    },
    // Câble intérieur/extérieur 900µm structure serrée LSZH-anti UV renforcé
    "Renforcé LSZH": {
      "Monomode OS2": {
        4: 0.76,
        6: 0.84,
        12: 1.31,
        24: 3.0,
        48: null,
      },
      "Multimode OM1": {
        4: 0.8,
        6: 0.96,
        12: 2.15,
        24: 3.99,
        48: null,
      },
      "Multimode OM2": {
        4: 0.74,
        6: 0.86,
        12: 1.85,
        24: 3.33,
        48: null,
      },
      "Multimode OM3": {
        4: 0.8,
        6: 0.95,
        12: 1.53,
        24: 3.77,
        48: null,
      },
      "Multimode OM4": {
        4: 1.28,
        6: 1.37,
        12: 2.19,
        24: 5.94,
        48: null,
      },
      "Multimode OM5": {
        4: null,
        6: null,
        12: null,
        24: null,
        48: null,
      },
    },
    // Câble à structure libre 250µm gaine PE
    "Standard PE": {
      "Monomode OS2": {
        4: 0.42,
        6: 0.42,
        12: 0.49,
        24: 0.7,
        48: 1.52,
      },
      "Multimode OM1": {
        4: null, // Pas disponible
        6: null, // Pas disponible
        12: null, // Pas disponible
        24: null, // Pas disponible
        48: null, // Pas disponible
      },
      "Multimode OM2": {
        4: null, // Pas disponible
        6: null, // Pas disponible
        12: null, // Pas disponible
        24: null, // Pas disponible
        48: null, // Pas disponible
      },
      "Multimode OM3": {
        4: 0.53,
        6: 0.65,
        12: 1.02,
        24: 1.71,
        48: null,
      },
      "Multimode OM4": {
        4: 0.8,
        6: 1.08,
        12: 1.63,
        24: 2.84,
        48: null,
      },
      "Multimode OM5": {
        4: null, // Pas disponible
        6: null, // Pas disponible
        12: null, // Pas disponible
        24: null, // Pas disponible
        48: null, // Pas disponible
      },
    },
    // Câble à structure libre 250 µm armé acier anti rongeurs gaine LSZH-anti UV
    "Armé Acier LSZH": {
      "Monomode OS2": {
        4: 0.6,
        6: 0.62,
        12: 0.69,
        24: 0.88,
        48: null,
      },
      "Multimode OM1": {
        4: null, // Pas disponible
        6: null, // Pas disponible
        12: null, // Pas disponible
        24: null, // Pas disponible
        48: null, // Pas disponible
      },
      "Multimode OM2": {
        4: null, // Pas disponible
        6: null, // Pas disponible
        12: null, // Pas disponible
        24: null, // Pas disponible
        48: null, // Pas disponible
      },
      "Multimode OM3": {
        4: 0.78,
        6: 0.85,
        12: 1.14,
        24: 1.8,
        48: null,
      },
      "Multimode OM4": {
        4: 1.07,
        6: 1.2,
        12: 1.86,
        24: 3.21,
        48: null,
      },
      "Multimode OM5": {
        4: null, // Pas disponible
        6: null, // Pas disponible
        12: null, // Pas disponible
        24: null, // Pas disponible
        48: null, // Pas disponible
      },
    },
    // Câble à structure libre 250 µm armé acier anti rongeurs gaine PE-anti UV
    "Armé Acier PE": {
      "Monomode OS2": {
        4: 0.6,
        6: 0.62,
        12: 0.69,
        24: 0.88,
        48: null,
      },
      "Multimode OM1": {
        4: null, // Pas disponible
        6: null, // Pas disponible
        12: null, // Pas disponible
        24: null, // Pas disponible
        48: null, // Pas disponible
      },
      "Multimode OM2": {
        4: null, // Pas disponible
        6: null, // Pas disponible
        12: null, // Pas disponible
        24: null, // Pas disponible
        48: null, // Pas disponible
      },
      "Multimode OM3": {
        4: 0.78,
        6: 0.85,
        12: 1.14,
        24: 1.8,
        48: null,
      },
      "Multimode OM4": {
        4: 1.07,
        6: 1.2,
        12: 1.86,
        24: 3.21,
        48: null,
      },
      "Multimode OM5": {
        4: null, // Pas disponible
        6: null, // Pas disponible
        12: null, // Pas disponible
        24: null, // Pas disponible
        48: null, // Pas disponible
      },
    },
  },

  // Main d'œuvre selon le type de câble et le nombre de fibres
  laborCosts: {
    // Pour Standard LSZH et Renforcé LSZH
    standard: {
      4: 59.48,
      6: 80.42,
      12: 143.24,
      24: 229.41,
      48: 453.82,
    },
    // Pour Standard PE, Armé Acier LSZH et Armé Acier PE
    other: {
      4: 75.48,
      6: 104.42,
      12: 178.24,
      24: 299.41,
      48: 593.82,
    },
  },

  // Coût de regainage selon le nombre de fibres
  resheathingCosts: {
    4: 20,
    6: 28,
    12: 48,
    24: 85,
    48: 170,
  },

  // Coût des tests
  testCosts: {
    Photométrie: 0.0,
    Réflectométrie: {
      4: 8.0,
      6: 12.0,
      12: 24.0,
      24: 48.0,
      48: 96.0,
    },
  },

  // Frais de port fixes
  shippingCost: 20.0,

  // Tarifs des connecteurs SC/APC par connecteur selon le nombre de fibres
  scapcConnectorPrices: {
    4: 4.0,
    6: 6.0,
    12: 12.0,
    24: 24.0,
    48: 48.0,
  },
};
