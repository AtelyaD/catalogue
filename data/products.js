/* ==========================================================================
   ATELYA D — DONNÉES DU SITE
   --------------------------------------------------------------------------
   C'est le SEUL fichier à modifier pour gérer le catalogue.

   ► AJOUTER UN PRODUIT
     1. Ajoutez vos photos dans le dossier  images/products/
          - images/products/24.webp          (image complète, ~800 px de large)
          - images/products/thumbs/24.webp   (miniature, ~480 px de large)
        (un JPG convient aussi : remplacez simplement "image" par "24.jpg"
         et mettez la même extension dans le dossier thumbs.)
     2. Copiez un bloc { ... } ci-dessous, collez-le à la fin de la liste
        "products", puis changez les valeurs.

   ► SUPPRIMER UN PRODUIT   : supprimez son bloc { ... } (virgule comprise).
   ► MODIFIER UN PRODUIT    : changez le texte entre guillemets.
   ► AFFICHER UN PRIX       : ajoutez   price: 45000,   (nombre, sans espace).
                              Il s'affichera "45 000 FCFA" et un tri par prix
                              apparaîtra tout seul. Sans prix : "Sur devis".
   ► METTRE EN AVANT        : featured: true  → le produit apparaît dans la
                              sélection de la page d'accueil.

   Champs d'un produit :
     id           identifiant unique, sans espace ni accent (sert dans l'URL)
     name         nom affiché
     category     id d'une catégorie ci-dessous
     description  courte accroche
     image        nom du fichier image (voir plus haut)
     featured     true / false (facultatif)
     price        prix en nombre (facultatif)
     focus        cadrage de la miniature, ex. "center top" (facultatif)
   ========================================================================== */

window.ATELYA = {

  /* ---------- Coordonnées & réglages généraux ---------- */
  site: {
    name: "Atelya D",
    baseline: "Au carrefour de l’innovation et de l’artisanat",
    url: "https://atelyad.github.io/catalogue/",
    whatsapp: "2290143787054",              // format international, sans + ni espaces
    phoneDisplay: "+229 01 43 78 70 54",
    phoneHref: "+2290143787054",
    email: "atelyadd@gmail.com",
    currency: "FCFA",
    /* Réseaux sociaux : collez l'adresse complète (https://...) pour que
       l'icône apparaisse dans le pied de page. Laissez "" pour la masquer. */
    socials: {
      instagram: "",
      facebook: "",
      twitter: "",
      linkedin: ""
    }
  },

  /* ---------- Catégories ---------- */
  categories: [
    { id: "etageres",   name: "Étagères & bibliothèques", cover: "05" },
    { id: "coiffeuses", name: "Coiffeuses & bureaux",     cover: "12" },
    { id: "tables",     name: "Tables & chevets",         cover: "15" },
    { id: "bancs",      name: "Bancs & rangements",       cover: "10" },
    { id: "accessoires",name: "Accessoires & déco",       cover: "17" }
  ],

  /* ---------- Produits ---------- */
  products: [
    { id: "etageres-murales-design",   name: "Étagères murales design",     category: "etageres",    description: "Mise en valeur des plantes et objets décoratifs", image: "01.webp", featured: true },
    { id: "coiffeuse-contemporaine",   name: "Coiffeuse contemporaine",     category: "coiffeuses",  description: "Structure originale et élégante",                  image: "03.webp" },
    { id: "bibliotheque-murale",       name: "Bibliothèque murale",         category: "etageres",    description: "Rangement discret et pratique",                    image: "02.webp", featured: true },
    { id: "table-d-appoint-courbee",   name: "Table d’appoint courbée",     category: "tables",      description: "Design fluide et fonctionnel",                     image: "04.webp", featured: true },
    { id: "etagere-ondulee",           name: "Étagère ondulée",             category: "etageres",    description: "Style artistique unique",                          image: "05.webp", featured: true },
    { id: "banc-a-chaussures-en-bois", name: "Banc à chaussures en bois",   category: "bancs",       description: "Style artistique unique",                          image: "06.webp" },
    { id: "table-de-lit-pivotante",    name: "Table de lit pivotante",      category: "tables",      description: "Pratique pour le quotidien",                       image: "07.webp" },
    { id: "bibliotheque-compacte",     name: "Meuble bibliothèque compact", category: "etageres",    description: "Rangement modulable en bois clair",                image: "08.webp" },
    { id: "coiffeuse-minimaliste",     name: "Coiffeuse minimaliste",       category: "coiffeuses",  description: "Design épuré avec miroir intégré",                 image: "09.webp" },
    { id: "banc-range-chaussures",     name: "Banc range-chaussures",       category: "bancs",       description: "Allie assise confortable et pratique",             image: "10.webp" },
    { id: "etagere-d-angle",           name: "Étagère d’angle",             category: "etageres",    description: "Optimisation des petits espaces",                  image: "11.webp" },
    { id: "bureau-d-angle-lumineux",   name: "Bureau d’angle lumineux",     category: "coiffeuses",  description: "Éclairage LED et rangement intégré",               image: "12.webp", featured: true },
    { id: "coiffeuse-vintage",         name: "Coiffeuse vintage",           category: "coiffeuses",  description: "Une finition de bois chaleureuse",                 image: "13.webp" },
    { id: "etagere-sculptee",          name: "Étagère sculptée",            category: "etageres",    description: "Design moderne et organique",                      image: "14.webp" },
    { id: "table-de-chevet-ronde",     name: "Table de chevet ronde",       category: "tables",      description: "Compacte et multifonction",                        image: "15.webp" },
    { id: "coiffeuse-compacte",        name: "Coiffeuse compacte",          category: "coiffeuses",  description: "Idéale pour les petits espaces",                   image: "16.webp" },
    { id: "porte-serviettes-en-bois",  name: "Porte-serviettes en bois",    category: "accessoires", description: "Rangement pratique et esthétique",                 image: "17.webp" },
    { id: "table-de-chevet-design",    name: "Table de chevet design",      category: "tables",      description: "Style moderne et doux",                            image: "18.webp" },
    { id: "table-a-manger-en-bois",    name: "Table à manger en bois",      category: "tables",      description: "Élégance naturelle et robuste",                    image: "19.webp", featured: true },
    { id: "support-livre-lunettes",    name: "Support livre & lunettes",    category: "accessoires", description: "Accessoire pratique et décoratif",                 image: "20.webp" },
    { id: "etagere-murale-ronde",      name: "Étagère murale ronde",        category: "etageres",    description: "Décoration légère et fonctionnelle",               image: "21.webp" },
    { id: "miroir-decoratif",          name: "Miroir décoratif",            category: "accessoires", description: "Touche moderne et colorée",                        image: "22.webp" },
    { id: "table-de-chevet-led",       name: "Table de chevet LED",         category: "tables",      description: "Éclairage intégré et rangement",                   image: "23.webp" }
  ]
};
