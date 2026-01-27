# Webshot

Extension Raycast pour capturer instantanément des screenshots d'une URL en versions desktop et mobile.

![Raycast](https://img.shields.io/badge/Raycast-Extension-FF6363)
![License](https://img.shields.io/badge/License-MIT-blue)

## Pourquoi Webshot ?

Besoin de vérifier rapidement le rendu responsive d'un site ? Webshot capture automatiquement deux screenshots en une seule commande : un en résolution desktop et un en émulation iPhone 14 Pro. Idéal pour les revues de design, la documentation ou le debugging.

## Fonctionnalités

- **Double capture** - Desktop (1456×816 @2x) et mobile (390×844) en une commande
- **Émulation réaliste** - User-Agent, viewport et événements touch iPhone 14 Pro
- **Compression optimisée** - PNG compressés pour un stockage minimal
- **Intégration Raycast** - Accessible via raccourci clavier

## Prérequis

- [Raycast](https://raycast.com/) installé
- [Google Chrome](https://www.google.com/chrome/) installé
- Node.js 18+

## Installation

```bash
# Cloner et installer les dépendances
git clone <repo-url>
cd webshot
npm install
```

Puis dans Raycast :
1. Ouvrez Raycast et tapez "Import Extension"
2. Sélectionnez le dossier du projet
3. L'extension est maintenant disponible

## Configuration

Copiez le fichier d'exemple et ajustez selon vos besoins :

```bash
cp .env.example .env
```

| Variable | Description | Défaut |
|----------|-------------|--------|
| `CHROME_PATH` | Chemin vers Chrome | `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome` |
| `OUTPUT_DIR` | Dossier de sortie | `~/Downloads/screenshots` |

## Utilisation

1. Ouvrez Raycast (`⌘ + Espace`)
2. Tapez "Capture Screenshot"
3. Entrez l'URL à capturer
4. Les fichiers sont sauvegardés dans le dossier configuré

**Exemple de sortie :**
```
~/Downloads/screenshots/
├── example.com-desktop.png
└── example.com-mobile.png
```

## Développement

```bash
npm run dev       # Mode développement Raycast
npm run build     # Build production
npm run lint      # Vérification du code
npm run fix-lint  # Correction automatique
```

## License

MIT
