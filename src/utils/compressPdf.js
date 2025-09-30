import * as pdfjsLib from "pdfjs-dist";
import jsPDF from "jspdf";

// Configuration du worker PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

/**
 * Compresse un PDF côté client en le rasterisant et en le reconstruisant
 * @param {File} file - Fichier PDF à compresser
 * @param {Object} options - Options de compression
 * @param {number} options.maxSize - Taille maximale en octets (défaut: 4MB)
 * @param {number} options.maxPages - Nombre maximum de pages (défaut: 50)
 * @param {number} options.initialDpi - DPI initial (défaut: 150)
 * @param {number} options.minDpi - DPI minimum (défaut: 96)
 * @param {number} options.initialQuality - Qualité JPEG initiale (défaut: 0.65)
 * @param {number} options.minQuality - Qualité JPEG minimum (défaut: 0.4)
 * @returns {Promise<Blob|null>} - PDF compressé ou null si impossible
 */
export async function compressPdfBrowser(file, options = {}) {
  const {
    maxSize = 4_000_000, // 4MB
    maxPages = 50,
    initialDpi = 150,
    minDpi = 96,
    initialQuality = 0.65,
    minQuality = 0.4,
  } = options;

  try {
    // Vérifier la taille initiale
    if (file.size <= maxSize) {
      return file; // Pas besoin de compression
    }

    // Charger le PDF
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;

    // Vérifier le nombre de pages
    if (pdf.numPages > maxPages) {
      console.warn(
        `PDF trop volumineux: ${pdf.numPages} pages (max: ${maxPages})`
      );
      return null;
    }

    // Essayer différentes combinaisons de qualité et DPI
    for (let quality = initialQuality; quality >= minQuality; quality -= 0.05) {
      for (let dpi = initialDpi; dpi >= minDpi; dpi -= 24) {
        const compressedPdf = await compressPdfWithSettings(pdf, dpi, quality);

        if (compressedPdf && compressedPdf.size <= maxSize) {
          console.log(
            `Compression réussie: ${file.size} → ${compressedPdf.size} octets (DPI: ${dpi}, Quality: ${quality})`
          );
          return compressedPdf;
        }

        // Libérer la mémoire
        if (compressedPdf) {
          URL.revokeObjectURL(compressedPdf);
        }
      }
    }

    console.warn("Impossible de compresser le PDF sous la taille limite");
    return null;
  } catch (error) {
    console.error("Erreur lors de la compression PDF:", error);
    return null;
  }
}

/**
 * Compresse un PDF avec des paramètres spécifiques
 * @param {Object} pdf - Document PDF chargé
 * @param {number} dpi - DPI pour la rasterisation
 * @param {number} quality - Qualité JPEG
 * @returns {Promise<Blob|null>} - PDF compressé ou null
 */
async function compressPdfWithSettings(pdf, dpi, quality) {
  try {
    const pdfDoc = new jsPDF();
    const scale = dpi / 72; // Conversion DPI vers échelle PDF.js

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale });

      // Créer un canvas pour la rasterisation
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      // Rasteriser la page
      await page.render({
        canvasContext: context,
        viewport: viewport,
      }).promise;

      // Convertir en image JPEG
      const imageData = canvas.toDataURL("image/jpeg", quality);

      // Ajouter à la page PDF
      if (pageNum === 1) {
        pdfDoc.addImage(imageData, "JPEG", 0, 0, 210, 297); // A4
      } else {
        pdfDoc.addPage();
        pdfDoc.addImage(imageData, "JPEG", 0, 0, 210, 297);
      }

      // Libérer la mémoire du canvas
      canvas.width = 0;
      canvas.height = 0;
    }

    // Générer le PDF compressé
    const pdfBlob = pdfDoc.output("blob");
    return pdfBlob;
  } catch (error) {
    console.error("Erreur lors de la compression avec paramètres:", error);
    return null;
  }
}

/**
 * Valide qu'un fichier est un PDF
 * @param {File} file - Fichier à valider
 * @returns {boolean} - True si c'est un PDF valide
 */
export function validatePdfFile(file) {
  if (!file) return false;

  // Vérifier le type MIME
  if (file.type !== "application/pdf") {
    return false;
  }

  // Vérifier l'extension
  if (!file.name.toLowerCase().endsWith(".pdf")) {
    return false;
  }

  return true;
}

/**
 * Échappe les caractères HTML pour la sécurité
 * @param {string} text - Texte à échapper
 * @returns {string} - Texte échappé
 */
export function escapeHtml(text) {
  if (!text) return "";

  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
