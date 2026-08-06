# Plan de production

## Objectif

Livrer un configurateur 3D fluide, lisible en vidéo et démontrable en moins de 5 minutes.

## Phase 1 - Base produit

- Garder une scène stable avec caméra, sol, environnement et objet bureau.
- Poser l'architecture de données pour les éléments du setup: bureau, siège, écrans, périphériques, déco, lumière, ambiance.
- Définir une UI simple en panneaux: catalogue, propriétés, presets, actions.

## Phase 2 - Cahier des charges minimum

- Bureau: dimensions, matériau, couleur.
- Chaise: choix de modèle, position, rotation.
- PC fixe ou laptop: variante sélectionnable.
- Écrans: 1 à 3 écrans, taille et orientation.
- Clavier et souris: presets rapides.
- Éclairage: intensité, température, couleur, placement.
- Décoration: plante, lampe, figurine, support casque.
- Ambiance: jour, sunset, nuit, néons.
- Caméra interactive: orbite, reset, angles favoris.

## Phase 3 - UX forte

- Sélection d'objet par clic dans la scène.
- Gizmos simples: déplacer, tourner, snap au sol.
- Presets prêts à l'emploi: minimal, gamer, senior dev, laptop nomad.
- États persistants en local pour reprendre une session.

## Phase 4 - Bonus à forte valeur

- Sauvegarde locale + export/import JSON.
- Capture d'écran depuis le canvas.
- Estimation de prix par configuration.
- Partage par URL encodée ou payload compact.
- Animations légères: allumage écrans, variation lumière, ambiance.

## Phase 5 - Performance et finition

- Mutualiser les matériaux et géométries répétées.
- Charger les assets en lazy et compresser les textures.
- Limiter les ombres coûteuses et surveiller le draw call count.
- Ajouter un fallback mobile et un mode qualité réduit.

## Ordre conseillé pour le reste de la semaine

1. Modèle de données + store global.
2. UI de personnalisation.
3. Objets obligatoires low poly ou stylisés.
4. Sauvegarde + export JSON.
5. Capture d'écran + preset shareable.
6. Polishing visuel, perf, pitch final.

## Grille d'évaluation ciblée

- 20/20 cahier des charges: couvrir tous les éléments minimum avant les bonus.
- 20/20 UI: interface compacte, claire et photogénique pour la vidéo.
- 15/15 UX: feedback immédiat, contrôles évidents, presets utiles.
- 15/15 scène 3D: cohérence d'échelle, lumière propre, matériaux homogènes.
- 10/10 perf: interaction fluide sur laptop standard.
- 10/10 créativité: univers visuel fort et presets mémorables.
- 5/5 IA: documenter les usages IA dans le README et la présentation.
- 5/5 présentation: raconter problème, architecture, arbitrages, résultats.