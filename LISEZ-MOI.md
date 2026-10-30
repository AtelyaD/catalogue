# Site Atelya D — guide de publication et de modification

Site statique (HTML, CSS, JavaScript). Aucun serveur, aucun framework, aucune
installation : compatible GitHub Pages tel quel.

## Contenu du dossier

```
index.html            Page d'accueil
catalogue.html        Catalogue (recherche, filtres, tri, fiche produit)
404.html              Page affichée si une adresse n'existe pas
data/products.js      ★ Produits, catégories, coordonnées (SEUL fichier à modifier)
assets/css/style.css  Styles
assets/js/            Scripts (site.js, home.js, catalogue.js)
images/               Logo, visuels, photos produits (WebP optimisé)
  products/           Image complète de chaque produit
  products/thumbs/    Miniature de chaque produit (affichée dans la grille)
robots.txt, sitemap.xml, .nojekyll   Référencement / compatibilité GitHub Pages
```

## Publier sur GitHub Pages

Le dépôt actuel est `atelyad/catalogue` (adresse publique
https://atelyad.github.io/catalogue/). Les adresses du site sont déjà réglées
pour cette URL.

1. Dans le dépôt, **supprimez les anciens fichiers** : `index.html`, `assets/`
   et `images/` (ils sont remplacés).
2. **Envoyez tout le contenu de ce dossier** à la racine du dépôt (y compris
   le fichier caché `.nojekyll`). Via le site GitHub : *Add file → Upload files*,
   glissez les fichiers et dossiers, puis *Commit changes*.
   Via Git : copiez le contenu dans votre clone, puis
   `git add -A && git commit -m "Refonte du site" && git push`.
3. Attendez 1 à 2 minutes, puis ouvrez https://atelyad.github.io/catalogue/
   (rechargez avec Ctrl+F5 si l'ancienne version s'affiche).

Pour tester avant publication : GitHub Pages n'est pas nécessaire, ouvrez
simplement `index.html` dans votre navigateur (les produits s'affichent aussi
en local). Seules les polices Google et la traduction demandent internet.

## Ajouter / modifier / supprimer un produit

Tout se passe dans **`data/products.js`** (instructions détaillées en haut du
fichier).

- **Ajouter** : mettez deux images dans `images/products/` (`24.webp`, ~800 px de
  large) et `images/products/thumbs/` (`24.webp`, ~480 px), puis copiez un bloc
  `{ id: ..., name: ... }` dans la liste.
- **Supprimer** : effacez son bloc.
- **Prix** : ajoutez `price: 45000,` à un produit. Il s'affiche « 45 000 FCFA »
  et un tri par prix apparaît automatiquement. Sans prix, le site affiche
  « Sur devis ».
- **Mettre en avant sur l'accueil** : `featured: true`.
- **Nouvelle catégorie** : ajoutez-la dans la liste `categories`.

Photos JPG/PNG acceptées (indiquez l'extension : `image: "24.jpg"`). Le format
WebP est conseillé car plus léger (convertisseur gratuit : squoosh.app).

## Changer les coordonnées ou ajouter les réseaux sociaux

Toujours dans `data/products.js`, bloc `site` : numéro WhatsApp, téléphone,
email, et adresses Instagram / Facebook / X / LinkedIn (les icônes n'apparaissent
dans le pied de page que si une adresse est renseignée).
Les numéros et l'email figurent aussi en dur dans les fichiers `.html`
(secours si JavaScript est désactivé) : si vous changez de numéro, faites une
recherche/remplacement de `2290143787054` et `+229 01 43 78 70 54` dans
`index.html` et `catalogue.html`.

## Points d'attention

- **Polices** : Cormorant Garamond et Jost, chargées depuis Google Fonts
  (gratuites). Sans internet, le site utilise des polices de secours.
- **Traduction FR → EN** : le bouton « EN » (fonction déjà présente sur l'ancien
  site) charge Google Traduction uniquement quand on clique dessus.
  C'est une traduction automatique.
- **Prix, stock, paiement, panier** : non existants dans le site d'origine, donc
  non créés. La commande passe par WhatsApp (message prérempli avec le nom du
  meuble). Un vrai panier/paiement exigerait un service externe (ex. Stripe,
  Shopify, ou un backend).
- **Anciennes pages** : `explore.html`, `about.html`, `trending.html` et
  `contact.html` n'ont jamais existé dans le dépôt ; la page `404.html` gère
  désormais ces cas.
- **Anciens fichiers devenus inutiles** (supprimés avec l'étape 1) : jQuery,
  Font Awesome (2,9 Mo), modèle Sass, galerie « Lorem ipsum », images en double
  (`*_.jpg`, `white-log.png`, `banner.jpg`…). Deux photos
  « WhatsApp Image 2026-03-09… » n'étaient pas utilisées sur l'ancien site ;
  elles n'ont pas été intégrées faute de nom/description.
