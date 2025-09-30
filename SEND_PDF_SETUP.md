# 📧 Configuration de l'envoi de PDF par email

## 🚀 Fonctionnalités ajoutées

- ✅ **Formulaire d'envoi** : Modal avec champs nom, email, message
- ✅ **Compression PDF** : Compression automatique côté client si > 4MB
- ✅ **Validation** : Vérification des types de fichiers et tailles
- ✅ **API serverless** : Route Vercel pour l'envoi d'emails
- ✅ **Interface intégrée** : Bouton "Envoyer par email" dans l'interface

## 🔧 Variables d'environnement requises

Ajoutez ces variables dans votre dashboard Vercel :

```bash
RESEND_API_KEY=re_xxxxxxxxxxxxx
CONTACT_FROM=noreply@votre-domaine.com
```

**Note :** L'adresse de réception est fixée sur `communication@xeilom.fr`

### 📝 Configuration Resend

1. **Créer un compte** : https://resend.com
2. **Obtenir la clé API** : Dashboard → API Keys → Create API Key
3. **Vérifier le domaine** : Ajouter et vérifier votre domaine
4. **Configurer l'email FROM** : Utiliser un email de votre domaine vérifié

## 🛠️ Installation des dépendances

```bash
npm install pdfjs-dist jspdf resend
```

## 📁 Fichiers créés/modifiés

### Nouveaux fichiers :

- `src/utils/compressPdf.js` - Compression PDF côté client
- `src/components/SendPdfModal.jsx` - Modal d'envoi
- `api/send-pdf.js` - API serverless Vercel
- `env.d.ts` - Types des variables d'environnement

### Fichiers modifiés :

- `src/App.jsx` - Intégration du modal
- `src/components/ResultsSection.jsx` - Bouton d'envoi
- `src/App.css` - Styles du modal
- `package.json` - Nouvelles dépendances

## 🎯 Utilisation

1. **Configurer une trunck** dans l'interface
2. **Cliquer sur "Envoyer par email"** dans la section résultats
3. **Remplir le formulaire** (nom, email, message optionnel)
4. **Le PDF sera automatiquement compressé** si nécessaire
5. **L'email sera envoyé** avec la configuration en pièce jointe

## 🔒 Sécurité

- ✅ **Validation côté client et serveur**
- ✅ **Échappement HTML** pour éviter les injections
- ✅ **Limitation de taille** (4MB client, 4.5MB serveur)
- ✅ **Vérification des types MIME**
- ✅ **Pas de logs sensibles**

## 🐛 Dépannage

### Erreur "PDF trop volumineux"

- Le PDF fait plus de 4MB après compression
- Solution : Réduire le nombre de pages ou la qualité

### Erreur "Méthode non autorisée"

- Vérifier que l'API est bien déployée sur Vercel
- Vérifier l'URL de l'API

### Erreur d'envoi d'email

- Vérifier les variables d'environnement
- Vérifier que le domaine est vérifié dans Resend
- Vérifier la clé API Resend
- Vérifier que `communication@xeilom.fr` est accessible

## 📊 Limites techniques

- **Taille max PDF** : 4MB (client), 4.5MB (serveur)
- **Pages max** : 50 pages (configurable)
- **Qualité min** : 0.4 (40%)
- **DPI min** : 96 DPI

## 🎨 Personnalisation

### Modifier les limites :

```javascript
// Dans src/utils/compressPdf.js
const options = {
  maxSize: 4_000_000, // 4MB
  maxPages: 50, // 50 pages
  initialDpi: 150, // 150 DPI
  minDpi: 96, // 96 DPI min
  initialQuality: 0.65, // 65% qualité
  minQuality: 0.4, // 40% qualité min
};
```

### Modifier l'email :

```javascript
// Dans api/send-pdf.js
const emailHtml = `
  // Votre template HTML personnalisé
`;
```
