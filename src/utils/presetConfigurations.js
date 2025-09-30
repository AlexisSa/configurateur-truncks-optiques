// Configurations pré-faites
export const presetConfigurations = [
  {
    name: "Configuration Standard",
    description: "Trunck optique standard pour usage général",
    options: {
      connecteurA: "LC",
      connecteurB: "LC",
      nombreFibres: "12",
      modeFibre: "Monomode OS2",
      typeCable: "Standard LSZH",
      longueur: "100",
      epanouissement: "Standard (900 µm)",
      typeTest: "Photométrie",
    },
  },
  {
    name: "Configuration Renforcée",
    description: "Trunck optique renforcé pour environnements difficiles",
    options: {
      connecteurA: "SC",
      connecteurB: "SC",
      nombreFibres: "24",
      modeFibre: "Multimode OM4",
      typeCable: "Renforcé LSZH",
      longueur: "200",
      epanouissement: "Regainé (2,8 mm)",
      typeTest: "Réflectométrie",
    },
  },
  {
    name: "Configuration Haute Performance",
    description: "Trunck optique haute performance pour applications critiques",
    options: {
      connecteurA: "SCA",
      connecteurB: "SCA",
      nombreFibres: "48",
      modeFibre: "Multimode OM5",
      typeCable: "Armé Acier LSZH",
      longueur: "500",
      epanouissement: "Regainé (2,8 mm)",
      typeTest: "Réflectométrie",
    },
  },
];
