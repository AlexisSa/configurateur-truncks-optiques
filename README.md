# Configurateur de Truncks Optiques

Application web moderne pour configurer des truncks optiques selon des spécifications techniques précises.

## 🚀 Fonctionnalités

- **Configuration complète** : 8 paramètres techniques configurables
- **Calcul de prix automatique** : Prix basé sur les options sélectionnées
- **Génération de référence** : Code produit unique selon la configuration
- **Configurations pré-faites** : 3 modèles prédéfinis (Standard, Renforcée, Haute Performance)
- **Export PDF** : Génération de devis professionnel
- **Interface responsive** : Optimisée pour tous les écrans
- **Tests complets** : Tests unitaires et d'intégration

## 🛠️ Technologies

- **React 19** : Framework frontend moderne
- **Vite** : Build tool ultra-rapide
- **CSS3** : Styles modernes avec variables CSS
- **jsPDF** : Génération de PDF côté client
- **html2canvas** : Conversion HTML vers image
- **Vitest** : Framework de tests

## 📦 Installation

```bash
# Cloner le projet
git clone [URL_DU_REPO]

# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# Lancer les tests
npm test

# Build de production
npm run build
```

## 🚀 Déploiement

### Vercel (Recommandé)

```bash
# Déploiement en une commande
npx vercel

# Ou avec configuration personnalisée
npx vercel --prod
```

### Autres options

- **Netlify** : Drag & drop du dossier `dist/`
- **GitHub Pages** : Utiliser l'action GitHub Pages
- **Firebase Hosting** : `firebase deploy`

## 📋 Configuration des options

1. **Connecteur A/B** : LC, SC, ST, SC/APC
2. **Nombre de fibres** : 4, 6, 12, 24, 48
3. **Mode fibre** : Monomode OS2, Multimode OM1-5
4. **Type de câble** : Standard, Renforcé, Armé
5. **Longueur** : Saisie libre en mètres
6. **Épanouissement** : Standard ou Regainé
7. **Type de test** : Photométrie ou Réflectométrie


## 🎯 Utilisation

1. Choisir une configuration pré-faite ou configurer manuellement
2. Remplir tous les champs obligatoires
3. Voir le prix et la référence générés automatiquement
4. Exporter en PDF pour obtenir un devis professionnel

## 📱 Responsive

L'application s'adapte à tous les écrans :

- **Desktop** : 5 colonnes d'options
- **Tablette** : 3-4 colonnes
- **Mobile** : 1-2 colonnes
- **Très petit écran** : Layout vertical

## 🧪 Tests

```bash
# Tests unitaires
npm test

# Tests avec interface
npm run test:ui

# Tests en mode watch
npm run test:run
```

## 📄 Licence

Projet privé - Tous droits réservés
