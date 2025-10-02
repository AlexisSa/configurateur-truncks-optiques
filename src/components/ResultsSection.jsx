import { useState } from "react";
import {
  calculatePrice,
  generateReference,
  isConfigurationAvailable,
  isConfigurationComplete,
} from "../utils/calculations.js";
import { generatePdfPreview, exportToPDF } from "../utils/pdfGenerator.js";

const ResultsSection = ({
  selectedOptions,
  onSaveClick,
  savedConfigsCount = 0,
}) => {
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);

  const price = calculatePrice(selectedOptions);
  const reference = generateReference(selectedOptions);
  const availability = isConfigurationAvailable(selectedOptions);

  // Calcul du prix à l'unité et de la quantité
  const quantity = parseInt(selectedOptions.quantite) || 1;
  const unitPrice = price && quantity > 1 ? price / quantity : null;

  const handleGeneratePdfPreview = async () => {
    try {
      const imgData = await generatePdfPreview(selectedOptions);
      setPdfPreviewUrl(imgData);
      setShowPdfPreview(true);
    } catch (error) {
      console.error(
        "Erreur lors de la génération de la prévisualisation:",
        error
      );
      alert("Erreur lors de la génération de la prévisualisation");
    }
  };

  const handleExportToPDF = async () => {
    try {
      await exportToPDF(selectedOptions);
    } catch (error) {
      console.error("Erreur lors de l'export PDF:", error);
    }
  };

  return (
    <div className="price-reference-card">
      <div className="card-header">
        <h2>Résultats de votre configuration</h2>
      </div>

      <div className="card-content">
        <div className="result-item">
          <div className="result-label">
            <span className="label-icon">📋</span>
            <span>Référence à commander</span>
          </div>
          <div
            className={`result-value ${reference ? "reference" : "incomplete"}`}
          >
            {reference || "Complétez la configuration"}
          </div>
        </div>

        <div className="result-item">
          <div className="result-label">
            <span className="label-icon">💰</span>
            <span>Prix public</span>
          </div>
          <div
            className={`result-value ${
              price
                ? "price"
                : availability?.available === false
                ? "error"
                : "incomplete"
            }`}
          >
            {price
              ? `${price} €`
              : availability?.available === false
              ? availability.reason
              : "Complétez la configuration"}
          </div>
        </div>

        {price && unitPrice && quantity > 1 && (
          <div className="unit-price-quantity-row">
            <div className="result-item">
              <div className="result-label">
                <span className="label-icon">💰</span>
                <span>Prix à l'unité</span>
              </div>
              <div className="result-value">{unitPrice.toFixed(2)} €</div>
            </div>

            <div className="result-item">
              <div className="result-label">
                <span className="label-icon">📦</span>
                <span>Quantité</span>
              </div>
              <div className="result-value">{quantity} produits</div>
            </div>
          </div>
        )}

        <div className="result-item">
          <div className="result-label">
            <span className="label-icon">📦</span>
            <span>Délai de fabrication</span>
          </div>
          <div className="result-value delivery">Environ 1 semaine</div>
        </div>
      </div>

      {isConfigurationComplete(selectedOptions) && (
        <div className="summary-section">
          <h3>Résumé de votre configuration</h3>
          <p>
            Trunck : {selectedOptions.connecteurA}/{selectedOptions.connecteurB}{" "}
            {selectedOptions.nombreFibres} Fibres {selectedOptions.modeFibre}{" "}
            {selectedOptions.typeCable} de {selectedOptions.longueur}m avec test
            de {selectedOptions.typeTest}
          </p>

          <div className="export-buttons">
            <button
              onClick={onSaveClick}
              className="save-config-button"
              title="Sauvegarder cette configuration"
              disabled={
                !isConfigurationComplete(selectedOptions) ||
                availability?.available === false
              }
            >
              💾 Sauvegarder
              {savedConfigsCount > 0 && (
                <span className="save-count">({savedConfigsCount})</span>
              )}
            </button>
            <button
              onClick={handleGeneratePdfPreview}
              className="preview-button"
              title="Prévisualiser le PDF"
              disabled={
                !isConfigurationComplete(selectedOptions) ||
                availability?.available === false
              }
            >
              👁️ Prévisualiser
            </button>
            <button
              onClick={handleExportToPDF}
              className="export-button"
              title="Exporter en PDF"
              disabled={
                !isConfigurationComplete(selectedOptions) ||
                availability?.available === false
              }
            >
              📄 Exporter en PDF
            </button>
          </div>
        </div>
      )}

      {/* Modal de prévisualisation PDF */}
      {showPdfPreview && (
        <div className="modal-overlay" onClick={() => setShowPdfPreview(false)}>
          <div
            className="modal-content pdf-preview-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>Prévisualisation du PDF</h3>
              <button
                className="modal-close"
                onClick={() => setShowPdfPreview(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body pdf-preview-body">
              {pdfPreviewUrl && (
                <div className="pdf-preview-container">
                  <img
                    src={pdfPreviewUrl}
                    alt="Prévisualisation PDF"
                    className="pdf-preview-image"
                  />
                  <div className="pdf-preview-actions">
                    <button
                      onClick={handleExportToPDF}
                      className="export-button"
                      title="Télécharger le PDF"
                    >
                      📄 Télécharger le PDF
                    </button>
                    <button
                      onClick={() => setShowPdfPreview(false)}
                      className="close-button"
                    >
                      Fermer
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsSection;
