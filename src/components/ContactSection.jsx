import { useState } from "react";
import {
  compressPdfBrowser,
  validatePdfFile,
  escapeHtml,
} from "../utils/compressPdf.js";
import {
  isConfigurationComplete,
  isConfigurationAvailable,
} from "../utils/calculations.js";

const ContactSection = ({ selectedOptions, onSendPdfClick }) => {
  const availability = isConfigurationAvailable(selectedOptions);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    societe: "",
    adresse: "",
    complement: "",
    ville: "",
    codePostal: "",
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

    if (!onSendPdfClick) {
      setError("Fonctionnalité d'envoi non disponible");
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
      setStatus("sending");
      setError("");
      setProgress("Génération et envoi du PDF en cours...");

      // Déclencher la génération et l'envoi du PDF
      await onSendPdfClick(formData);

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
          adresse: "",
          complement: "",
          ville: "",
          codePostal: "",
          message: "",
        });
        setStatus("idle");
        setProgress("");
      }, 2000);
    } catch (err) {
      console.error("Erreur lors de l'envoi:", err);
      setError("Erreur de connexion. Veuillez réessayer.");
      setStatus("error");
    }
  };

  return (
    <div className="contact-section">
      <div className="contact-card">
        <div className="contact-header">
          <h2>Nous contacter</h2>
        </div>

        <div className="contact-content">
          <div className="contact-methods">
            <div className="contact-method">
              <div className="method-icon phone">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                </svg>
              </div>
              <div className="method-content">
                <h3>Téléphone</h3>
                <p>03.65.61.04.20</p>
                <p>02.53.35.60.40</p>
              </div>
            </div>

            <div className="contact-method">
              <div className="method-icon email">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
              </div>
              <div className="method-content">
                <h3>Email</h3>
                <p>info.xeilom@xeilom.fr</p>
              </div>
            </div>

            <div className="contact-method">
              <div className="method-icon website">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                </svg>
              </div>
              <div className="method-content">
                <h3>Site web</h3>
                <p>xeilom.fr</p>
              </div>
            </div>
          </div>

          <div className="contact-form-section">
            <h3>Demander un devis personnalisé</h3>
            <p>
              Remplissez le formulaire ci-dessous pour nous envoyer votre
              configuration et recevoir un devis détaillé.
            </p>

            {status === "ok" ? (
              <div className="success-message">
                <div className="success-icon">✅</div>
                <h4>Merci !</h4>
                <p>Votre configuration a été envoyée avec succès.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
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
                      disabled={
                        status === "sending" || status === "compressing"
                      }
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
                      disabled={
                        status === "sending" || status === "compressing"
                      }
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
                      disabled={
                        status === "sending" || status === "compressing"
                      }
                      placeholder="Votre numéro de téléphone"
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
                      disabled={
                        status === "sending" || status === "compressing"
                      }
                      placeholder="Nom de votre société"
                    />
                  </div>
                </div>

                <div className="address-section">
                  <h4>
                    Adresse de livraison{" "}
                    <span className="optional">(optionnel)</span>
                  </h4>
                  <small className="field-help">
                    Indiquez votre adresse pour recevoir un devis avec frais de
                    livraison
                  </small>

                  <div className="form-group">
                    <label htmlFor="adresse">Adresse</label>
                    <input
                      type="text"
                      id="adresse"
                      name="adresse"
                      value={formData.adresse}
                      onChange={handleInputChange}
                      disabled={
                        status === "sending" || status === "compressing"
                      }
                      placeholder="Numéro et nom de rue"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="complement">Complément d'adresse</label>
                    <input
                      type="text"
                      id="complement"
                      name="complement"
                      value={formData.complement}
                      onChange={handleInputChange}
                      disabled={
                        status === "sending" || status === "compressing"
                      }
                      placeholder="Appartement, étage, bâtiment..."
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="codePostal">Code postal</label>
                      <input
                        type="text"
                        id="codePostal"
                        name="codePostal"
                        value={formData.codePostal}
                        onChange={handleInputChange}
                        disabled={
                          status === "sending" || status === "compressing"
                        }
                        placeholder="Votre code postal"
                        maxLength="5"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="ville">Ville</label>
                      <input
                        type="text"
                        id="ville"
                        name="ville"
                        value={formData.ville}
                        onChange={handleInputChange}
                        disabled={
                          status === "sending" || status === "compressing"
                        }
                        placeholder="Votre ville"
                      />
                    </div>
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
                    type="submit"
                    disabled={
                      status === "sending" ||
                      status === "compressing" ||
                      !isConfigurationComplete(selectedOptions) ||
                      availability?.available === false
                    }
                    className="send-button"
                    aria-busy={status === "sending" || status === "compressing"}
                  >
                    {status === "sending"
                      ? "Envoi..."
                      : status === "compressing"
                      ? "Compression..."
                      : "📧 Demander un devis"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
