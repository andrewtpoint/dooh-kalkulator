# DOOH Kalkulator – WordPress Plugin

## Installation

1. Lade die ZIP-Datei `dooh-kalkulator.zip` herunter
2. Gehe im WordPress Admin zu: **Plugins → Installieren → Plugin hochladen**
3. Wähle die ZIP-Datei und klicke „Jetzt installieren"
4. Plugin aktivieren

## Verwendung

Füge den Shortcode auf jeder Seite oder jedem Beitrag ein:

```
[dooh_kalkulator]
```

## Voraussetzungen

- WordPress 5.8+
- PHP 7.4+
- WordPress.com: Business- oder Commerce-Plan (für JavaScript)

## Projektstruktur

```
dooh-kalkulator/
├── dooh-kalkulator.php     ← Haupt-Plugin-Datei (Shortcode-Registrierung)
├── templates/
│   └── kalkulator.php      ← HTML Template
└── assets/
    ├── style.css           ← Styles
    └── kalkulator.js       ← Berechnungslogik (Alpine.js)
```

## Features

- EBL-Berechnung basierend auf Stelen & Laufzeit
- Preis-Tiers (XL / L / M / S) mit konfigurierbaren Schwellen
- Werktage-Berechnung (Mo–Sa, Sonntage ausgeschlossen)
- Kampagnen-Realisierbarkeit & Empfehlungen
- PDF Export
- Admin-Panel zur Konfiguration
