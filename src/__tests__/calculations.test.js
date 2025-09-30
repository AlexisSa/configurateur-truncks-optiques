import {
  isConfigurationComplete,
  getAvailableFiberModes,
  isConfigurationAvailable,
  getPriceBreakdown,
  calculatePrice,
  generateReference,
} from "../utils/calculations.js";

describe("calculations", () => {
  describe("isConfigurationComplete", () => {
    test("retourne true pour une configuration complète", () => {
      const completeConfig = {
        connecteurA: "LC",
        connecteurB: "SC",
        nombreFibres: "12",
        modeFibre: "Monomode OS2",
        typeCable: "Standard LSZH",
        longueur: "100",
        epanouissement: "Standard (900 µm)",
        typeTest: "Photométrie",
      };

      expect(isConfigurationComplete(completeConfig)).toBe(true);
    });

    test("retourne false pour une configuration incomplète", () => {
      const incompleteConfig = {
        connecteurA: "LC",
        connecteurB: "",
        nombreFibres: "12",
        modeFibre: "Monomode OS2",
        typeCable: "Standard LSZH",
        longueur: "100",
        epanouissement: "Standard (900 µm)",
        typeTest: "Photométrie",
      };

      expect(isConfigurationComplete(incompleteConfig)).toBe(false);
    });
  });

  describe("getAvailableFiberModes", () => {
    test("retourne tous les modes si SC/APC n'est pas sélectionné", () => {
      const config = {
        connecteurA: "LC",
        connecteurB: "SC",
      };

      const modes = getAvailableFiberModes(config);
      expect(modes).toContain("Monomode OS2");
      expect(modes).toContain("Multimode OM1");
      expect(modes).toContain("Multimode OM2");
      expect(modes).toContain("Multimode OM3");
      expect(modes).toContain("Multimode OM4");
      expect(modes).toContain("Multimode OM5");
    });

    test("retourne seulement Monomode OS2 si SC/APC est sélectionné", () => {
      const config = {
        connecteurA: "SCA",
        connecteurB: "LC",
      };

      const modes = getAvailableFiberModes(config);
      expect(modes).toEqual(["Monomode OS2"]);
    });
  });

  describe("isConfigurationAvailable", () => {
    test("retourne available: false pour une configuration incomplète", () => {
      const incompleteConfig = {
        connecteurA: "LC",
        connecteurB: "",
        nombreFibres: "12",
        modeFibre: "Monomode OS2",
        typeCable: "Standard LSZH",
        longueur: "100",
        epanouissement: "Standard (900 µm)",
        typeTest: "Photométrie",
      };

      const result = isConfigurationAvailable(incompleteConfig);
      expect(result.available).toBe(false);
      expect(result.reason).toBe("Configuration incomplète");
    });

    test("retourne available: false si SC/APC est sélectionné avec un mode fibre incorrect", () => {
      const invalidConfig = {
        connecteurA: "SCA",
        connecteurB: "LC",
        nombreFibres: "12",
        modeFibre: "Multimode OM3",
        typeCable: "Standard LSZH",
        longueur: "100",
        epanouissement: "Standard (900 µm)",
        typeTest: "Photométrie",
      };

      const result = isConfigurationAvailable(invalidConfig);
      expect(result.available).toBe(false);
      expect(result.reason).toBe(
        "SC/APC n'est disponible qu'avec Monomode OS2"
      );
    });
  });

  describe("calculatePrice", () => {
    test("retourne null pour une configuration incomplète", () => {
      const incompleteConfig = {
        connecteurA: "LC",
        connecteurB: "",
        nombreFibres: "12",
        modeFibre: "Monomode OS2",
        typeCable: "Standard LSZH",
        longueur: "100",
        epanouissement: "Standard (900 µm)",
        typeTest: "Photométrie",
      };

      expect(calculatePrice(incompleteConfig)).toBe(null);
    });

    test("retourne un prix calculé pour une configuration valide", () => {
      const validConfig = {
        connecteurA: "LC",
        connecteurB: "SC",
        nombreFibres: "12",
        modeFibre: "Monomode OS2",
        typeCable: "Standard LSZH",
        longueur: "100",
        epanouissement: "Standard (900 µm)",
        typeTest: "Photométrie",
      };

      const price = calculatePrice(validConfig);
      expect(price).toBeGreaterThan(0);
      expect(typeof price).toBe("number");
    });
  });

  describe("generateReference", () => {
    test("retourne null pour une configuration incomplète", () => {
      const incompleteConfig = {
        connecteurA: "LC",
        connecteurB: "",
        nombreFibres: "12",
        modeFibre: "Monomode OS2",
        typeCable: "Standard LSZH",
        longueur: "100",
        epanouissement: "Standard (900 µm)",
        typeTest: "Photométrie",
      };

      expect(generateReference(incompleteConfig)).toBe(null);
    });

    test("génère une référence pour une configuration valide", () => {
      const validConfig = {
        connecteurA: "LC",
        connecteurB: "SC",
        nombreFibres: "12",
        modeFibre: "Monomode OS2",
        typeCable: "Standard LSZH",
        longueur: "100",
        epanouissement: "Standard (900 µm)",
        typeTest: "Photométrie",
      };

      const reference = generateReference(validConfig);
      expect(reference).toMatch(/^T\d+SD0H-OS2LC\/SC\d+P$/);
    });
  });

  describe("getPriceBreakdown", () => {
    test("retourne null pour une configuration incomplète", () => {
      const incompleteConfig = {
        connecteurA: "LC",
        connecteurB: "",
        nombreFibres: "12",
        modeFibre: "Monomode OS2",
        typeCable: "Standard LSZH",
        longueur: "100",
        epanouissement: "Standard (900 µm)",
        typeTest: "Photométrie",
      };

      expect(getPriceBreakdown(incompleteConfig)).toBe(null);
    });

    test("retourne un détail des prix pour une configuration valide", () => {
      const validConfig = {
        connecteurA: "LC",
        connecteurB: "SC",
        nombreFibres: "12",
        modeFibre: "Monomode OS2",
        typeCable: "Standard LSZH",
        longueur: "100",
        epanouissement: "Standard (900 µm)",
        typeTest: "Photométrie",
      };

      const breakdown = getPriceBreakdown(validConfig);
      expect(breakdown).toHaveProperty("cable");
      expect(breakdown).toHaveProperty("connectors");
      expect(breakdown).toHaveProperty("labor");
      expect(breakdown).toHaveProperty("resheathing");
      expect(breakdown).toHaveProperty("test");
      expect(breakdown).toHaveProperty("strands");
      expect(breakdown).toHaveProperty("total");
    });
  });
});
