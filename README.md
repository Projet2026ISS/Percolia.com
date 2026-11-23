# Percolia.com

Site vitrine de Percolia, en Next.js (App Router).

## Structure

- `app/page.js` — page d'accueil (avec l'intro animée du logo)
- `app/contact/page.js` — page de contact
- `components/Examples.js` — les trois vidéos d'exemple de la page d'accueil (voir plus bas)
- `lib/examples.js` — liste des exemples (légende, description, lien LinkedIn)
- `public/videos/` — les vidéos et leurs images fixes
- `components/IntroSequence.js` — animation d'intro (points → oiseau → envol → logo)
- `components/BirdMark.js` — logo oiseau statique (utilisé dans le header)
- `lib/birdGraph.js` — géométrie du graphe (nœuds / arêtes / triangles) de l'oiseau
- `app/globals.css` — palette et typographie (Sora + Inter)

## Vidéos d'exemple

La page d'accueil montre trois exemples dans une seule scène au format tablette paysage (4:3) : trois points
sous la vidéo, passage en fondu de l'une à l'autre (clic sur un point, flèches du clavier, glissement du doigt,
ou automatiquement à la fin de chaque vidéo). Au-dessus, le lien « Retrouvez-nous sur LinkedIn » reste toujours
affiché.

Chaque exemple existe pour les deux thèmes du site, avec la même chronologie (changer de thème en cours de
lecture reprend au même instant dans l'autre fichier) :

| Fichier | Contenu |
| --- | --- |
| `public/videos/<id>-dark.mp4`, `<id>-light.mp4` | 1440 × 1080, 30 i/s, H.264, sans son |
| `public/videos/<id>-dark.jpg`, `<id>-light.jpg` | image fixe, montrée quand la lecture automatique est refusée |

Les `<id>` sont ceux de `lib/examples.js` (`kitti`, `olive`, `aidetech`). Le fond des vidéos est exactement la
couleur de fond du site (`#071b2e` en sombre, `#ffffff` en clair) : c'est ce qui les fond dans la page, sans
cadre. Pour remplacer une vidéo, garder ce fond, au moins 16 px de marge unie autour du contenu, et le même
nom de fichier.

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
