import { useState, useEffect } from "react";
import {
  getAvailableFiberModes,
  generateReference,
  calculatePrice,
} from "../utils/calculations.js";

// Hook personnalisé pour gérer l'état de la configuration
export const useConfiguration = () => {
  const [selectedOptions, setSelectedOptions] = useState({
    connecteurA: "",
    connecteurB: "",
    nombreFibres: "",
    modeFibre: "",
    typeCable: "",
    longueur: "",
    epanouissement: "",
    typeTest: "",
    quantite: "1",
  });

  const [savedConfigs, setSavedConfigs] = useState([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Charger les configurations sauvegardées au démarrage
  useEffect(() => {
    const saved = localStorage.getItem("savedConfigurations");
    if (saved) {
      try {
        setSavedConfigs(JSON.parse(saved));
      } catch (error) {
        console.error(
          "Erreur lors du chargement des configurations sauvegardées:",
          error
        );
      }
    }
  }, []);

  // Sauvegarder les configurations dans le localStorage
  useEffect(() => {
    localStorage.setItem("savedConfigurations", JSON.stringify(savedConfigs));
  }, [savedConfigs]);

  // Fonction pour ajouter un toast
  const addToast = (type, title, message) => {
    const id = Date.now();
    const newToast = { id, type, title, message };
    setToasts((prev) => [...prev, newToast]);

    // Auto-suppression après 5 secondes
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  // Fonction pour supprimer un toast
  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // Fonction pour sauvegarder une configuration
  const saveConfiguration = (name) => {
    if (!name.trim()) {
      addToast(
        "error",
        "Erreur",
        "Veuillez saisir un nom pour la configuration"
      );
      return false;
    }

    const newConfig = {
      id: Date.now(),
      name: name.trim(),
      options: { ...selectedOptions },
      date: new Date().toISOString(),
      reference: generateReference(selectedOptions),
      price: calculatePrice(selectedOptions),
    };

    setSavedConfigs((prev) => [newConfig, ...prev]);
    addToast(
      "success",
      "Sauvegardé",
      `Configuration "${name}" sauvegardée avec succès`
    );
    setShowSaveModal(false);
    return true;
  };

  // Fonction pour charger une configuration
  const loadConfiguration = (config) => {
    setSelectedOptions(config.options);
    addToast("success", "Chargé", `Configuration "${config.name}" chargée`);
  };

  // Fonction pour supprimer une configuration
  const deleteConfiguration = (id) => {
    const config = savedConfigs.find((c) => c.id === id);
    setSavedConfigs((prev) => prev.filter((c) => c.id !== id));
    addToast("success", "Supprimé", `Configuration "${config.name}" supprimée`);
  };

  // Fonction pour renommer une configuration
  const renameConfiguration = (id, newName) => {
    if (!newName.trim()) {
      addToast("error", "Erreur", "Veuillez saisir un nom valide");
      return false;
    }

    setSavedConfigs((prev) =>
      prev.map((config) =>
        config.id === id ? { ...config, name: newName.trim() } : config
      )
    );
    addToast("success", "Renommé", `Configuration renommée en "${newName}"`);
    return true;
  };

  // Fonction pour supprimer toutes les configurations
  const clearAllConfigurations = () => {
    setSavedConfigs([]);
    addToast(
      "success",
      "Effacé",
      "Toutes les configurations ont été supprimées"
    );
  };

  // Fonction pour obtenir l'état d'un champ
  const getFieldState = (fieldName) => {
    const value = selectedOptions[fieldName];

    if (value === "") {
      return "empty"; // État neutre pour les champs vides
    }

    // Vérifier les erreurs spécifiques
    if (fieldName === "modeFibre") {
      if (
        (selectedOptions.connecteurA === "SCA" ||
          selectedOptions.connecteurB === "SCA") &&
        value !== "Monomode OS2"
      ) {
        return "error";
      }
    }

    return "completed";
  };

  const handleOptionChange = (option, value) => {
    setSelectedOptions((prev) => {
      const newOptions = {
        ...prev,
        [option]: value,
      };

      // Si un connecteur change et que SC/APC est sélectionné, forcer Monomode OS2
      if (
        (option === "connecteurA" || option === "connecteurB") &&
        (value === "SCA" ||
          newOptions.connecteurA === "SCA" ||
          newOptions.connecteurB === "SCA")
      ) {
        newOptions.modeFibre = "Monomode OS2";
      }

      // Si le mode fibre change et que SC/APC est sélectionné mais pas Monomode OS2, réinitialiser
      if (
        option === "modeFibre" &&
        (newOptions.connecteurA === "SCA" ||
          newOptions.connecteurB === "SCA") &&
        value !== "Monomode OS2"
      ) {
        newOptions.modeFibre = "Monomode OS2";
      }

      // Forcer l'épanouissement "Regainé" pour Standard PE, Armé Acier LSZH et Armé Acier PE
      if (
        option === "typeCable" &&
        (value === "Standard PE" ||
          value === "Armé Acier LSZH" ||
          value === "Armé Acier PE")
      ) {
        newOptions.epanouissement = "Regainé (2,8 mm)";
      }

      return newOptions;
    });
  };

  const loadPresetConfiguration = (preset) => {
    setSelectedOptions(preset.options);
    addToast("success", "Présélection", "Configuration pré-faite chargée");
  };

  const getAvailableFiberModesForCurrentConfig = () => {
    return getAvailableFiberModes(selectedOptions);
  };

  return {
    selectedOptions,
    handleOptionChange,
    loadPresetConfiguration,
    getAvailableFiberModesForCurrentConfig,
    // Nouvelles fonctionnalités de sauvegarde
    savedConfigs,
    showSaveModal,
    setShowSaveModal,
    saveConfiguration,
    loadConfiguration,
    deleteConfiguration,
    renameConfiguration,
    clearAllConfigurations,
    // Indicateurs d'état
    getFieldState,
    // Notifications
    toasts,
    addToast,
    removeToast,
  };
};
