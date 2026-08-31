# Percolia.com

Site vitrine de Percolia, en Next.js (App Router).

## Structure

- `app/page.js` — page d'accueil (avec l'intro animée du logo)
- `app/contact/page.js` — page de contact
- `components/IntroSequence.js` — animation d'intro (points → oiseau → envol → logo)
- `components/BirdMark.js` — logo oiseau statique (utilisé dans le header)
- `lib/birdGraph.js` — géométrie du graphe (nœuds / arêtes / triangles) de l'oiseau
- `app/globals.css` — palette et typographie (Sora + Inter)

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
