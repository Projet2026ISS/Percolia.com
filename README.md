# Percolia.com

Site vitrine de Percolia, en Next.js (App Router).

## Identité de marque

La marque (logo, oiseau-réseau animé, mot-symbole, couleurs) vient du dépôt
canonique [Ludwig-H/Percolia](https://github.com/Ludwig-H/Percolia/tree/main/Logo)
et est reprise telle quelle dans `public/brand/` :

- `percolia-bird-compact.svg` — oiseau seul, utilisé dans le header (< 96px)
- `percolia-lockup-horizontal.svg` — mot-symbole + oiseau perché (statique)
- `flight-stage.svg` + `bird-animation.js` — scène animée (deux oiseaux,
  clips keyframés, IK) utilisée sur la page d'accueil, extraite de
  `Logo/Oiseau/demo.html` du dépôt ci-dessus
- `CHARTE_GRAPHIQUE.md` — charte graphique de référence

Pour mettre à jour ces fichiers, régénérer depuis le dépôt source (voir son
`Logo/README.md`) puis recopier dans `public/brand/`.

## Structure

- `app/page.js` → `components/HomeClient.js` — page d'accueil
- `app/contact/page.js` — page de contact
- `components/FlightStage.js` — charge et démarre la scène animée du header
- `app/globals.css` — tokens de couleur officiels + typographie (Fredoka + Inter)

## Développement local

```bash
npm install
npm run dev
```

Puis ouvrir http://localhost:3000.

## Build de production

```bash
npm run build
npm run start
```

## Déploiement

Les deux pages sont statiques (prerendered) — déployable sur Vercel, Netlify, ou
tout hébergeur Node.js.
