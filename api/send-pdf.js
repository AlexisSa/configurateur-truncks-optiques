import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function escapeHtml(text) {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
      if (data.length > 10 * 1024 * 1024)
        reject(new Error("Payload trop volumineux"));
    });
    req.on("end", () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on("error", reject);
  });
}

// POST /api/send-pdf
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    const body = await readJsonBody(req);

    const nom = body.nom?.toString().trim();
    const prenom = body.prenom?.toString().trim();
    const email = body.email?.toString().trim();
    const telephone = body.telephone?.toString().trim();
    const societe = body.societe?.toString().trim();
    const adresse = (body.adresse || "").toString();
    const complement = (body.complement || "").toString();
    const ville = (body.ville || "").toString();
    const codePostal = (body.codePostal || "").toString();
    const message = (body.message || "").toString();
    const pdfName = (body.pdfName || "configuration.pdf").toString();
    const pdfType = (body.pdfType || "application/pdf").toString();
    const pdfBase64 = body.pdfBase64?.toString();
    const pdfSize = Number(body.pdfSize || 0);
    const configData = body.configData || null;

    if (!nom || !prenom || !email || !telephone || !societe || !pdfBase64) {
      return res.status(400).json({ error: "Champs obligatoires manquants" });
    }
    if (pdfType !== "application/pdf") {
      return res.status(400).json({ error: "Le fichier doit être un PDF" });
    }

    const cleanedBase64 = pdfBase64.includes(",")
      ? pdfBase64.split(",")[1]
      : pdfBase64;
    const pdfBuffer = Buffer.from(cleanedBase64, "base64");
    if (pdfBuffer.length > 10_000_000) {
      // Augmenté à 10MB
      return res
        .status(400)
        .json({ error: "Fichier trop volumineux (max 10MB)" });
    }

    let configInfo = "";
    if (configData) {
      try {
        configInfo = `
          <h3>Détails de la configuration :</h3>
          <ul>
            <li><strong>Référence :</strong> ${escapeHtml(
              configData.reference || "N/A"
            )}</li>
            <li><strong>Prix :</strong> ${escapeHtml(
              String(configData.price ?? "N/A")
            )} €</li>
            <li><strong>Connecteur A :</strong> ${escapeHtml(
              configData.connecteurA || "N/A"
            )}</li>
            <li><strong>Connecteur B :</strong> ${escapeHtml(
              configData.connecteurB || "N/A"
            )}</li>
            <li><strong>Nombre de fibres :</strong> ${escapeHtml(
              String(configData.nombreFibres || "N/A")
            )}</li>
            <li><strong>Mode fibre :</strong> ${escapeHtml(
              configData.modeFibre || "N/A"
            )}</li>
            <li><strong>Type de câble :</strong> ${escapeHtml(
              configData.typeCable || "N/A"
            )}</li>
            <li><strong>Longueur :</strong> ${escapeHtml(
              String(configData.longueur || "N/A")
            )} m</li>
            <li><strong>Épanouissement :</strong> ${escapeHtml(
              configData.epanouissement || "N/A"
            )}</li>
            <li><strong>Type de test :</strong> ${escapeHtml(
              configData.typeTest || "N/A"
            )}</li>
            <li><strong>Quantité :</strong> ${escapeHtml(
              String(configData.quantite || "1")
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
                       <p><strong>Nom :</strong> ${escapeHtml(
                         nom
                       )} ${escapeHtml(prenom)}</p>
                       <p><strong>Email :</strong> ${escapeHtml(email)}</p>
                       <p><strong>Téléphone :</strong> ${escapeHtml(
                         telephone
                       )}</p>
                       <p><strong>Société :</strong> ${escapeHtml(societe)}</p>
                       ${
                         adresse || ville || codePostal
                           ? `
                         <p><strong>Adresse de livraison :</strong></p>
                         <ul style="margin: 5px 0; padding-left: 20px;">
                           ${adresse ? `<li>${escapeHtml(adresse)}</li>` : ""}
                           ${
                             complement
                               ? `<li>${escapeHtml(complement)}</li>`
                               : ""
                           }
                           ${
                             codePostal && ville
                               ? `<li>${escapeHtml(codePostal)} ${escapeHtml(
                                   ville
                                 )}</li>`
                               : ""
                           }
                           ${
                             !codePostal && ville
                               ? `<li>${escapeHtml(ville)}</li>`
                               : ""
                           }
                           ${
                             codePostal && !ville
                               ? `<li>${escapeHtml(codePostal)}</li>`
                               : ""
                           }
                         </ul>
                       `
                           : ""
                       }
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
                  Math.round((pdfSize / 1024 / 1024) * 100) / 100
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

    // Email pour XEILOM (communication@xeilom.fr)
    const emailDataXeilom = {
      from: process.env.CONTACT_FROM,
      to: "communication@xeilom.fr",
      reply_to: email,
      subject: `Nouveau PDF du configurateur — ${escapeHtml(nom)} ${escapeHtml(
        prenom
      )}`,
      html: emailHtml,
      attachments: [
        {
          filename: pdfName || "configuration.pdf",
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    };

    // Email pour le client (copie de confirmation)
    const emailDataClient = {
      from: process.env.CONTACT_FROM,
      to: email,
      subject: `Votre configuration de trunck optique - ${escapeHtml(nom)} ${escapeHtml(
        prenom
      )}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Confirmation de votre configuration</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #363bc7; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
              .content { background: #f8f9fa; padding: 20px; border-radius: 0 0 8px 8px; }
              .info { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #363bc7; }
              .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>✅ Configuration reçue</h1>
                <p>Merci ${escapeHtml(prenom)} pour votre demande de devis</p>
              </div>
              
              <div class="content">
                <div class="info">
                  <h3>📋 Votre configuration</h3>
                  <p><strong>Référence :</strong> ${escapeHtml(configData?.reference || "N/A")}</p>
                  <p><strong>Prix public :</strong> ${escapeHtml(String(configData?.price ?? "N/A"))} €</p>
                  <p><strong>Délai de fabrication :</strong> Environ 1 semaine</p>
                </div>

                <div class="info">
                  <h3>📞 Prochaines étapes</h3>
                  <p>Notre équipe va étudier votre demande et vous contactera dans les plus brefs délais pour finaliser votre commande.</p>
                  <p>Vous pouvez nous joindre au <strong>03.65.61.04.20</strong> ou <strong>02.53.35.60.40</strong> pour toute question.</p>
                </div>

                <div class="info">
                  <h3>📎 Pièce jointe</h3>
                  <p>Vous trouverez en pièce jointe le PDF détaillé de votre configuration.</p>
                </div>
              </div>
              
              <div class="footer">
                <p>Merci de votre confiance - XEILOM</p>
                <p>Spécialiste en solutions optiques professionnelles</p>
              </div>
            </div>
          </body>
        </html>
      `,
      attachments: [
        {
          filename: pdfName || "configuration.pdf",
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    };

    console.log("Tentative d'envoi des emails avec Resend...");
    console.log("From:", process.env.CONTACT_FROM);
    console.log("To XEILOM: communication@xeilom.fr");
    console.log("To Client:", email);
    console.log("PDF size:", pdfBuffer.length, "bytes");

    // Envoyer l'email à XEILOM
    const resultXeilom = await resend.emails.send(emailDataXeilom);
    console.log("Résultat email XEILOM:", JSON.stringify(resultXeilom, null, 2));

    if (resultXeilom.error) {
      console.error("Erreur Resend XEILOM:", resultXeilom.error);
      return res.status(500).json({
        error: "Erreur lors de l'envoi de l'email à XEILOM",
        details: resultXeilom.error,
      });
    }

    // Envoyer l'email au client
    const resultClient = await resend.emails.send(emailDataClient);
    console.log("Résultat email Client:", JSON.stringify(resultClient, null, 2));

    if (resultClient.error) {
      console.error("Erreur Resend Client:", resultClient.error);
      return res.status(500).json({
        error: "Erreur lors de l'envoi de l'email au client",
        details: resultClient.error,
      });
    }

    console.log("Emails envoyés avec succès");
    console.log("ID email XEILOM:", resultXeilom.data?.id);
    console.log("ID email Client:", resultClient.data?.id);
    
    return res.status(200).json({ 
      ok: true, 
      messageIds: {
        xeilom: resultXeilom.data?.id,
        client: resultClient.data?.id
      }
    });
  } catch (error) {
    console.error("Erreur dans l'API send-pdf:", error);
    return res.status(500).json({ error: "Erreur interne du serveur" });
  }
}
