import { useState } from "react";
import "./App.css";
import { useConfiguration } from "./hooks/useConfiguration.js";
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
  const [pdfBlob, setPdfBlob] = useState(null);

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

  // Fonction pour générer le PDF et l'afficher dans ContactSection
  const handleSendPdf = async () => {
    try {
      const { generatePdfPreview } = await import("./utils/pdfGenerator.js");
      const imgData = await generatePdfPreview(selectedOptions);

      // Créer un Blob à partir de l'image (pour l'instant, on utilise l'image)
      // Dans une vraie implémentation, on générerait le PDF complet
      const response = await fetch(imgData);
      const blob = await response.blob();

      setPdfBlob(blob);
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error);
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
        <ConfigurationGrid
          selectedOptions={selectedOptions}
          handleOptionChange={handleOptionChange}
          getAvailableFiberModesForCurrentConfig={
            getAvailableFiberModesForCurrentConfig
          }
          getFieldState={getFieldState}
        />

        <div className="results-section">
          <ResultsSection
            selectedOptions={selectedOptions}
            onSaveClick={() => setShowSaveModal(true)}
            savedConfigsCount={savedConfigs.length}
            onSendPdfClick={handleSendPdf}
          />
          <ContactSection 
            pdfBlob={pdfBlob}
            configData={{
              reference: selectedOptions
                ? generateReference(selectedOptions)
                : null,
              price: selectedOptions ? calculatePrice(selectedOptions) : null,
              ...selectedOptions,
            }}
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
