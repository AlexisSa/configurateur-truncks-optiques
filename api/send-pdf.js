import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Fonction serverless Vercel pour envoyer un PDF par email
 */
export default async function handler(req, res) {
  // Vérifier que c'est une requête POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    // Récupérer les données du formulaire
    const formData = await req.formData();

    const nom = formData.get("nom");
    const prenom = formData.get("prenom");
    const email = formData.get("email");
    const telephone = formData.get("telephone");
    const societe = formData.get("societe");
    const message = formData.get("message");
    const pdfFile = formData.get("pdf");
    const configDataStr = formData.get("configData");

    // Validation des champs obligatoires
    if (!nom || !prenom || !email || !telephone || !societe || !pdfFile) {
      return res.status(400).json({
        error: "Champs obligatoires manquants",
      });
    }

    // Validation du fichier PDF
    if (pdfFile.type !== "application/pdf") {
      return res.status(400).json({
        error: "Le fichier doit être un PDF",
      });
    }

    // Vérifier la taille du fichier (4.5MB max par sécurité)
    const maxSize = 4_500_000; // 4.5MB
    if (pdfFile.size > maxSize) {
      return res.status(400).json({
        error: "Fichier trop volumineux (max 4.5MB)",
      });
    }

    // Convertir le fichier en Buffer
    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdfBuffer = Buffer.from(arrayBuffer);

    // Préparer les données de configuration si disponibles
    let configInfo = "";
    if (configDataStr) {
      try {
        const configData = JSON.parse(configDataStr);
        configInfo = `
          <h3>Détails de la configuration :</h3>
          <ul>
            <li><strong>Référence :</strong> ${escapeHtml(
              configData.reference || "N/A"
            )}</li>
            <li><strong>Prix :</strong> ${escapeHtml(
              configData.price || "N/A"
            )} €</li>
            <li><strong>Connecteur A :</strong> ${escapeHtml(
              configData.connecteurA || "N/A"
            )}</li>
            <li><strong>Connecteur B :</strong> ${escapeHtml(
              configData.connecteurB || "N/A"
            )}</li>
            <li><strong>Nombre de fibres :</strong> ${escapeHtml(
              configData.nombreFibres || "N/A"
            )}</li>
            <li><strong>Mode fibre :</strong> ${escapeHtml(
              configData.modeFibre || "N/A"
            )}</li>
            <li><strong>Type de câble :</strong> ${escapeHtml(
              configData.typeCable || "N/A"
            )}</li>
            <li><strong>Longueur :</strong> ${escapeHtml(
              configData.longueur || "N/A"
            )} m</li>
            <li><strong>Épanouissement :</strong> ${escapeHtml(
              configData.epanouissement || "N/A"
            )}</li>
            <li><strong>Type de test :</strong> ${escapeHtml(
              configData.typeTest || "N/A"
            )}</li>
            <li><strong>Quantité :</strong> ${escapeHtml(
              configData.quantite || "1"
            )}</li>
          </ul>
        `;
      } catch (err) {
        console.warn(
          "Erreur lors du parsing des données de configuration:",
          err
        );
      }
    }

    // Construire le contenu HTML de l'email
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Nouvelle configuration de trunck optique</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #363bc7; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f8f9fa; padding: 20px; border-radius: 0 0 8px 8px; }
            .info { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #363bc7; }
            .message { background: #e3f2fd; padding: 15px; margin: 15px 0; border-radius: 5px; }
            ul { margin: 10px 0; }
            li { margin: 5px 0; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔧 Nouvelle configuration de trunck optique</h1>
              <p>Reçue le ${new Date().toLocaleDateString("fr-FR", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}</p>
            </div>
            
            <div class="content">
              <div class="info">
                <h3>👤 Informations du client :</h3>
                <p><strong>Nom :</strong> ${escapeHtml(nom)} ${escapeHtml(
      prenom
    )}</p>
                <p><strong>Email :</strong> ${escapeHtml(email)}</p>
                <p><strong>Téléphone :</strong> ${escapeHtml(telephone)}</p>
                <p><strong>Société :</strong> ${escapeHtml(societe)}</p>
              </div>

              ${configInfo}

              ${
                message
                  ? `
                <div class="message">
                  <h3>💬 Message du client :</h3>
                  <p>${escapeHtml(message)}</p>
                </div>
              `
                  : ""
              }

              <div class="info">
                <h3>📎 Pièce jointe :</h3>
                <p>Configuration PDF (${
                  Math.round((pdfFile.size / 1024 / 1024) * 100) / 100
                } MB)</p>
              </div>
            </div>
            
            <div class="footer">
              <p>Email généré automatiquement par le configurateur de truncks optiques XEILOM</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Envoyer l'email via Resend
    const emailData = {
      from: process.env.CONTACT_FROM,
      to: "communication@xeilom.fr",
      reply_to: email,
      subject: `Nouveau PDF du configurateur — ${escapeHtml(nom)} ${escapeHtml(
        prenom
      )}`,
      html: emailHtml,
      attachments: [
        {
          filename: pdfFile.name || "configuration.pdf",
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    };

    const result = await resend.emails.send(emailData);

    if (result.error) {
      console.error("Erreur Resend:", result.error);
      return res.status(500).json({
        error: "Erreur lors de l'envoi de l'email",
      });
    }

    console.log("Email envoyé avec succès:", result.data?.id);

    return res.status(200).json({
      ok: true,
      messageId: result.data?.id,
    });
  } catch (error) {
    console.error("Erreur dans l'API send-pdf:", error);
    return res.status(500).json({
      error: "Erreur interne du serveur",
    });
  }
}

/**
 * Échappe les caractères HTML pour la sécurité
 * @param {string} text - Texte à échapper
 * @returns {string} - Texte échappé
 */
function escapeHtml(text) {
  if (!text) return "";

  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
