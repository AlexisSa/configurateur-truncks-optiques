import { useState } from "react";
import "./App.css";
import { useConfiguration } from "./hooks/useConfiguration.js";
import { useEmbedResize } from "./hooks/useEmbedResize.js";
import {
  Header,
  ConfigurationGrid,
  ResultsSection,
  ContactSection,
  PresetModal,
  ToastContainer,
  SaveModal,
} from "./components/index.js";
import { generateReference, calculatePrice } from "./utils/calculations.js";

function App() {
  const [showPresetModal, setShowPresetModal] = useState(false);

  useEmbedResize();

  const {
    selectedOptions,
    handleOptionChange,
    loadPresetConfiguration,
    getAvailableFiberModesForCurrentConfig,
    // Nouvelles fonctionnalités
    savedConfigs,
    showSaveModal,
    setShowSaveModal,
    saveConfiguration,
    loadConfiguration,
    deleteConfiguration,
    renameConfiguration,
    clearAllConfigurations,
    getFieldState,
    toasts,
    removeToast,
  } = useConfiguration();

  // Fonction pour générer le PDF et l'envoyer directement
  const handleSendPdf = async (formData) => {
    try {
      const { generatePdfBlob } = await import("./utils/pdfGenerator.js");
      const pdfData = await generatePdfBlob(selectedOptions);

      // Construire le payload JSON
      const payload = {
        nom: formData.nom.trim(),
        prenom: formData.prenom.trim(),
        email: formData.email.trim(),
        telephone: formData.telephone.trim(),
        societe: formData.societe.trim(),
        adresse: formData.adresse.trim(),
        complement: formData.complement.trim(),
        ville: formData.ville.trim(),
        codePostal: formData.codePostal.trim(),
        message: formData.message.trim(),
        pdfName: pdfData.fileName,
        pdfType: "application/pdf",
        pdfBase64: `data:application/pdf;base64,${pdfData.base64}`,
        pdfSize: pdfData.size,
        configData: {
          reference: selectedOptions
            ? generateReference(selectedOptions)
            : null,
          price: selectedOptions ? calculatePrice(selectedOptions) : null,
          ...selectedOptions,
        },
      };

      // Envoyer via l'API (JSON)
      const response2 = await fetch("/api/send-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response2.json();

      if (!result.ok) {
        throw new Error(result.error || "Erreur lors de l'envoi");
      }

      return result;
    } catch (error) {
      console.error("Erreur lors de la génération/envoi du PDF:", error);
      throw error;
    }
  };

  return (
    <div className="app">
      <Header />

      <div className="preset-button-container">
        <button
          onClick={() => setShowPresetModal(true)}
          className="preset-modal-button"
        >
          ⚡ Configurations pré-faites
        </button>
      </div>

      <main className="app-main">
        <div className="configuration-layout">
          <div className="configuration-left">
            <ConfigurationGrid
              selectedOptions={selectedOptions}
              handleOptionChange={handleOptionChange}
              getAvailableFiberModesForCurrentConfig={
                getAvailableFiberModesForCurrentConfig
              }
              getFieldState={getFieldState}
            />
          </div>

          <div className="configuration-right">
            <ResultsSection
              selectedOptions={selectedOptions}
              onSaveClick={() => setShowSaveModal(true)}
              savedConfigsCount={savedConfigs.length}
            />
          </div>
        </div>

        <div className="contact-section-full">
          <ContactSection
            selectedOptions={selectedOptions}
            onSendPdfClick={handleSendPdf}
          />
        </div>
      </main>

      {/* Modals */}
      <PresetModal
        showPresetModal={showPresetModal}
        setShowPresetModal={setShowPresetModal}
        loadPresetConfiguration={loadPresetConfiguration}
      />

      <SaveModal
        showSaveModal={showSaveModal}
        setShowSaveModal={setShowSaveModal}
        selectedOptions={selectedOptions}
        savedConfigs={savedConfigs}
        saveConfiguration={saveConfiguration}
        loadConfiguration={loadConfiguration}
        deleteConfiguration={deleteConfiguration}
        renameConfiguration={renameConfiguration}
        clearAllConfigurations={clearAllConfigurations}
      />

      {/* Notifications toast */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}

export default App;
