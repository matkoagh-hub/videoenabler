# VideoEnabler

YouTube-like video player that works behind corporate firewalls. Uses a local HTML5 player (Video.js) with direct video URLs — no YouTube embeds, no WebSockets.

**Why it works at work:** HLS and MP4 streaming uses plain HTTPS requests (XHR/fetch), the same as Brightcove. No WebSocket connections, no YouTube domains.

---

## Ako pridať video (`videos.js`)

Otvor súbor `videos.js` a pridaj záznam do poľa `VIDEO_CATALOG`:

```js
{
  id: "moje-video",              // unikátne ID (bez medzier)
  title: "Názov videa",
  description: "Popis...",       // voliteľné
  thumbnail: "https://...",      // URL miniatúry alebo relatívna cesta
  src: "https://.../video.mp4",  // priamy odkaz na video
  type: "video/mp4",             // pozri typy nižšie
  duration: "5:22",              // len zobrazovací reťazec
  category: "firemné",           // voliteľné (filtrovanie v bočnom paneli)
  tags: ["produkt", "demo"]      // voliteľné (vyhľadávanie)
}
```

### Typy videa (`type`)

| Formát | Hodnota `type` |
|--------|----------------|
| MP4    | `"video/mp4"` |
| HLS (.m3u8) | `"application/x-mpegURL"` |
| WebM   | `"video/webm"` |

Ak vynecháš `type`, prehrávač ho odhadne podľa prípony URL.

---

## Nasadenie – Synology NAS (Container Manager)

### Predpoklady
- Synology NAS s DSM 7.2+
- Nainštalovaný **Container Manager** (v Správcovom centre → Centrum balíčkov)
- Repozitár stiahnutý/naklonovaný na NAS (napr. cez Git alebo File Station do `/docker/videoenabler`)

---

### Spôsob 1 – GUI v Container Manager (odporúčané)

#### Krok 1 – Skopíruj súbory na NAS

Cez **File Station** vytvor priečinok `/docker/videoenabler` a nahraj všetky súbory projektu (alebo použi Git cez SSH).

#### Krok 2 – Otvor Container Manager

`DSM` → `Container Manager` → záložka **Projekt**

#### Krok 3 – Vytvor nový projekt

1. Klikni **Vytvoriť**
2. **Názov projektu:** `videoenabler`
3. **Cesta:** `/docker/videoenabler` (kde máš súbory)
4. **Zdroj:** vyber `docker-compose.yml` zo súborov projektu
5. Klikni **Ďalej** → **Hotovo**

Container Manager automaticky:
- Stiahne obraz `nginx:alpine`
- Zostaví Docker image (`docker build`)
- Spustí kontajner na porte `8080`

#### Krok 4 – Otvor stránku

Otvor prehliadač a prejdi na:
```
http://<IP-tvojho-NAS>:8080
```

Napr.: `http://192.168.1.100:8080`

---

### Spôsob 2 – SSH / terminál

```bash
# Pripoj sa na NAS cez SSH (v DSM: Ovládací panel → Terminál → Povoliť SSH)
ssh admin@192.168.1.100

# Prejdi do priečinka projektu
cd /volume1/docker/videoenabler

# Zostav a spusti
docker compose up -d --build

# Skontroluj stav
docker ps | grep videoenabler
```

---

### Aktualizácia videa bez restartu kontajnera

`videos.js` je mountovaný ako volume — stačí ho upraviť a obnoviť prehliadač:

```bash
# Na NAS (SSH)
nano /volume1/docker/videoenabler/videos.js
# ... ulož zmeny ...
# Obnov prehliadač — nové video sa ihneď zobrazí
```

---

### Zmena portu

Uprav `docker-compose.yml`:
```yaml
ports:
  - "9000:80"   # zmeň 8080 na iný voľný port
```
Potom reštartuj kontajner v Container Manager alebo cez `docker compose up -d`.

---

### Firewall / prístup z práce

Ak chceš k NAS pristupovať aj z práce (nie len doma):

- **Tailscale** (odporúčané) – nainštaluj Tailscale na NAS aj na pracovný počítač, získaš privátne IP adresy bez potreby otvárania portov.
- **Synology QuickConnect** – jednoduchý prístup cez `quickconnect.to/tvoj-id`, ale pomalší.
- **Port forwarding** na routeri – otvor port 8080 smerom von (menej bezpečné).

---

## Nasadenie – GitHub Pages

1. Pushni do `main` vetvy
2. GitHub Actions (`.github/workflows/deploy.yml`) automaticky nasadí stránku na `gh-pages` vetvu
3. V GitHub repozitári: **Settings → Pages → Source: Deploy from branch → gh-pages**
4. Stránka bude dostupná na: `https://<username>.github.io/videoenabler/`

> **Poznámka:** Pre GitHub Pages musia byť videá hostované na serveri s CORS hlavičkami. Priame MP4 z väčšiny CDN (Cloudflare, Bunny.net, atď.) fungujú bez problémov.

---

## Štruktúra projektu

```
videoenabler/
├── index.html          ← prehľad videí (grid)
├── player.html         ← prehrávač videa
├── videos.js           ← zoznam videí (edituj toto)
├── css/style.css       ← tmavá YouTube téma
├── js/
│   ├── catalog.js      ← zdieľané funkcie
│   └── player-init.js  ← inicializácia Video.js
├── vendor/
│   ├── video.min.js    ← Video.js 8.x (lokálne, bez CDN)
│   └── video-js.min.css
├── assets/logo.svg
├── Dockerfile
├── nginx.conf
└── docker-compose.yml
```

## Technické poznámky

- **Video.js 8.x** obsahuje HLS (VHS) engine priamo v bundle — žiadny extra plugin
- HLS prehrávanie = len HTTPS XHR požiadavky, **žiadne WebSockety**
- Video.js je uložený lokálne (`vendor/`) — žiadne externé CDN požiadavky
- CORS hlavičky v nginx sú potrebné len ak sám hostuješ video súbory na NAS
