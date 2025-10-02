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

    // Logo XEILOM en base64
    const logoBase64 =
      "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";

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
            .header-content { display: flex; align-items: center; margin-bottom: 10px; }
            .logo { height: 40px; margin-right: 15px; }
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
            <div style="text-align: center; margin-bottom: 20px;">
              <img src="https://configurateur-truncks-optiques.vercel.app/logo.png" alt="XEILOM Logo" style="height: 60px; margin-bottom: 15px;" />
            </div>
            <div class="header">
              <div class="header-content">
                <div>
                  <h1>🔧 Nouvelle configuration de trunck optique</h1>
                  <p>Reçue le ${new Date().toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}</p>
                </div>
              </div>
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
      subject: `Nouveau configurateur de trunck optique — ${escapeHtml(
        societe
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
      subject: `Votre configuration de trunck optique - Xeilom`,
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
              .header-content { display: flex; align-items: center; margin-bottom: 10px; }
              .logo { height: 40px; margin-right: 15px; }
              .content { background: #f8f9fa; padding: 20px; border-radius: 0 0 8px 8px; }
              .info { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #363bc7; }
              .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <div class="container">
              <div style="text-align: center; margin-bottom: 20px;">
                <img src="https://configurateur-truncks-optiques.vercel.app/logo.png" alt="XEILOM Logo" style="height: 60px; margin-bottom: 15px;" />
              </div>
              <div class="header">
                <div class="header-content">
                  <div>
                    <h1>✅ Configuration reçue</h1>
                    <p>Merci ${escapeHtml(
                      prenom
                    )} pour votre demande de devis</p>
                  </div>
                </div>
              </div>
              
              <div class="content">
                <div class="info">
                  <h3>📋 Votre configuration</h3>
                  <p><strong>Référence :</strong> ${escapeHtml(
                    configData?.reference || "N/A"
                  )}</p>
                  <p><strong>Prix public :</strong> ${escapeHtml(
                    String(configData?.price ?? "N/A")
                  )} €</p>
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
    console.log(
      "Résultat email XEILOM:",
      JSON.stringify(resultXeilom, null, 2)
    );

    if (resultXeilom.error) {
      console.error("Erreur Resend XEILOM:", resultXeilom.error);
      return res.status(500).json({
        error: "Erreur lors de l'envoi de l'email à XEILOM",
        details: resultXeilom.error,
      });
    }

    // Envoyer l'email au client
    const resultClient = await resend.emails.send(emailDataClient);
    console.log(
      "Résultat email Client:",
      JSON.stringify(resultClient, null, 2)
    );

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
        client: resultClient.data?.id,
      },
    });
  } catch (error) {
    console.error("Erreur dans l'API send-pdf:", error);
    return res.status(500).json({ error: "Erreur interne du serveur" });
  }
}
