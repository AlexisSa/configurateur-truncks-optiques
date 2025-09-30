import { useState } from "react";
import {
  compressPdfBrowser,
  validatePdfFile,
  escapeHtml,
} from "../utils/compressPdf.js";

const SendPdfModal = ({ isOpen, onClose, pdfBlob, configData }) => {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    societe: "",
    message: "",
  });
  const [status, setStatus] = useState("idle"); // idle | compressing | sending | ok | error
  const [error, setError] = useState("");
  const [progress, setProgress] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!pdfBlob) {
      setError("Aucun PDF à envoyer");
      setStatus("error");
      return;
    }

    // Validation des champs
    if (
      !formData.nom.trim() ||
      !formData.prenom.trim() ||
      !formData.email.trim() ||
      !formData.telephone.trim() ||
      !formData.societe.trim()
    ) {
      setError("Veuillez remplir tous les champs obligatoires");
      setStatus("error");
      return;
    }

    // Validation email basique
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Veuillez entrer une adresse email valide");
      setStatus("error");
      return;
    }

    try {
      setStatus("compressing");
      setError("");
      setProgress("Compression du PDF en cours...");

      // Créer un File à partir du Blob
      const pdfFile = new File([pdfBlob], "configuration.pdf", {
        type: "application/pdf",
      });

      // Vérifier si compression nécessaire
      let finalPdf = pdfFile;
      if (pdfFile.size > 4_000_000) {
        setProgress(
          "Compression du PDF (cela peut prendre quelques instants)..."
        );
        const compressedPdf = await compressPdfBrowser(pdfFile);

        if (!compressedPdf) {
          setError(
            "PDF trop volumineux après compression. Veuillez réduire la taille du document."
          );
          setStatus("error");
          return;
        }

        finalPdf = new File([compressedPdf], "configuration-compressed.pdf", {
          type: "application/pdf",
        });
        setProgress(
          `PDF compressé: ${
            Math.round((finalPdf.size / 1024 / 1024) * 100) / 100
          } MB`
        );
      }

      setStatus("sending");
      setProgress("Envoi en cours...");

      // Préparer les données pour l'envoi
      const formDataToSend = new FormData();
      formDataToSend.append("nom", formData.nom.trim());
      formDataToSend.append("prenom", formData.prenom.trim());
      formDataToSend.append("email", formData.email.trim());
      formDataToSend.append("telephone", formData.telephone.trim());
      formDataToSend.append("societe", formData.societe.trim());
      formDataToSend.append("message", formData.message.trim());
      formDataToSend.append("pdf", finalPdf);

      // Ajouter les données de configuration si disponibles
      if (configData) {
        formDataToSend.append("configData", JSON.stringify(configData));
      }

      // Envoyer via l'API
      const response = await fetch("/api/send-pdf", {
        method: "POST",
        body: formDataToSend,
      });

      const result = await response.json();

      if (result.ok) {
        setStatus("ok");
        setProgress("PDF envoyé avec succès !");
        // Réinitialiser le formulaire après 2 secondes
        setTimeout(() => {
          setFormData({
            nom: "",
            prenom: "",
            email: "",
            telephone: "",
            societe: "",
            message: "",
          });
          setStatus("idle");
          setProgress("");
          onClose();
        }, 2000);
      } else {
        setError(result.error || "Erreur lors de l'envoi");
        setStatus("error");
      }
    } catch (err) {
      console.error("Erreur lors de l'envoi:", err);
      setError("Erreur de connexion. Veuillez réessayer.");
      setStatus("error");
    }
  };

  const handleClose = () => {
    if (status === "sending" || status === "compressing") {
      return; // Empêcher la fermeture pendant l'envoi
    }
    setFormData({
      nom: "",
      prenom: "",
      email: "",
      telephone: "",
      societe: "",
      message: "",
    });
    setStatus("idle");
    setError("");
    setProgress("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📧 Envoyer la configuration par email</h2>
          <button
            className="close-button"
            onClick={handleClose}
            disabled={status === "sending" || status === "compressing"}
            aria-label="Fermer"
          >
            ×
          </button>
        </div>

        <div className="modal-body">
          {status === "ok" ? (
            <div className="success-message">
              <div className="success-icon">✅</div>
              <h3>Merci !</h3>
              <p>Votre configuration a été envoyée avec succès.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="send-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nom">
                    Nom <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="nom"
                    name="nom"
                    value={formData.nom}
                    onChange={handleInputChange}
                    required
                    disabled={status === "sending" || status === "compressing"}
                    placeholder="Votre nom"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="prenom">
                    Prénom <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="prenom"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleInputChange}
                    required
                    disabled={status === "sending" || status === "compressing"}
                    placeholder="Votre prénom"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  Email <span className="required">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={status === "sending" || status === "compressing"}
                  placeholder="votre@email.com"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="telephone">
                    Téléphone <span className="required">*</span>
                  </label>
                  <input
                    type="tel"
                    id="telephone"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleInputChange}
                    required
                    disabled={status === "sending" || status === "compressing"}
                    placeholder="06 12 34 56 78"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="societe">
                    Société <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="societe"
                    name="societe"
                    value={formData.societe}
                    onChange={handleInputChange}
                    required
                    disabled={status === "sending" || status === "compressing"}
                    placeholder="Nom de votre société"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message">Message (optionnel)</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  disabled={status === "sending" || status === "compressing"}
                  placeholder="Ajoutez un message personnalisé..."
                  rows="4"
                />
              </div>

              {pdfBlob && (
                <div className="pdf-info">
                  <div className="pdf-icon">📄</div>
                  <div className="pdf-details">
                    <strong>Configuration.pdf</strong>
                    <span>
                      {Math.round((pdfBlob.size / 1024 / 1024) * 100) / 100} MB
                    </span>
                  </div>
                </div>
              )}

              {progress && (
                <div className="progress-message">
                  <div className="spinner"></div>
                  <span>{progress}</span>
                </div>
              )}

              {error && (
                <div className="error-message">
                  <div className="error-icon">❌</div>
                  <span>{error}</span>
                </div>
              )}

              <div className="form-actions">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={status === "sending" || status === "compressing"}
                  className="cancel-button"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={status === "sending" || status === "compressing"}
                  className="send-button"
                  aria-busy={status === "sending" || status === "compressing"}
                >
                  {status === "sending"
                    ? "Envoi..."
                    : status === "compressing"
                    ? "Compression..."
                    : "Envoyer le PDF"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SendPdfModal;
