# Testautomatisering - Exempelprojekt

Ett exempelprojekt för att lära sig testautomatisering i en DevOpSec-kurs.

## Om projektet

Detta är en liten webbshop byggd med:

- **Frontend:** Vite + React + TypeScript
- **Backend:** Node.js + Express
- **Databas:** SQLite (ingen installation krävs)
- **Övrigt:** Stöd för flera språk (engelska, svenska, norska)

## Komma igång

```bash
# Installera beroenden
npm install

# Starta utvecklingsserver
npm run dev

# Eller bygg och kör produktionsversion
npm run prod
```

Öppna [http://localhost:5173](http://localhost:5173) (dev) eller [http://localhost:5001](http://localhost:5001) (prod).

---

## Testtyper

Projektet innehåller tre typer av automatiserade tester:

### 1. Enhetstester (Vitest)

Testar enskilda funktioner och komponenter isolerat.

```bash
# Kör en gång
npm run test:run

# Kör med watch-läge
npm run test

# Kör med UI
npm run test:ui
```

**Vad testas:**
- `src/test/productPageHelpers.test.ts` - hjälpfunktioner för produktsidan
- `src/test/Select.test.tsx` - React-komponent för dropdown

### 2. E2E-tester (Playwright)

Testar hela applikationen i en riktig webbläsare.

```bash
# Kör mot produktionsbygge
npm run test:e2e

# Kör mot utvecklingsserver
npm run test:e2e:dev

# Kör med UI
npm run test:e2e:ui
```

**Vad testas:**
- Startsidan laddas korrekt
- Navigation till "Om oss"-sidan
- Kategorifilter visas
- Sorteringsalternativ fungerar

### 3. API-tester (Newman/Postman)

Testar backend-API:et direkt med HTTP-anrop.

```bash
# Starta servern först
npm run backend

# I en annan terminal, kör testerna
npm run test:api
```

**Vad testas:**
- `GET /api/products` - hämta alla produkter
- `GET /api/products/1` - hämta en produkt
- `GET /api/exchange-rates` - hämta valutakurser
- `GET /api/cart` - hämta kundvagn

**Postman-import:** Filen `api-tests/collection.json` kan importeras i Postman för manuell testning och vidareutveckling av API-tester.

---

## CI/CD med GitHub Actions

Filen `.github/workflows/test.yml` kör alla tester automatiskt vid push och pull requests.

**Flödet:**

1. Checka ut kod
2. Installera Node.js och beroenden
3. Cacha Playwright-browsers (snabbare efterföljande körningar)
4. Bygg projektet
5. Kör enhetstester
6. Starta backend-server
7. Kör E2E-tester
8. Kör API-tester

Vid fel sparas Playwright-rapport som artifact för felsökning.

---

## Projektstruktur

```
├── src/                  # Frontend (React)
│   ├── test/             # Enhetstester
│   ├── pages/            # Sidkomponenter
│   ├── parts/            # Återanvändbara komponenter
│   └── utils/            # Hjälpfunktioner
├── backend/              # Backend (Express)
│   ├── classes/          # Server och API-logik
│   ├── databases/        # SQLite-databaser
│   └── settings.json     # Konfiguration
├── e2e/                  # E2E-tester (Playwright)
├── api-tests/            # API-tester (Newman)
└── .github/workflows/    # CI/CD-pipeline
```

---

## Lärandemål

Efter att ha arbetat med detta projekt ska du kunna:

- Skriva och köra enhetstester med Vitest
- Skriva och köra E2E-tester med Playwright
- Skriva och köra API-tester med Newman/Postman
- Sätta upp en CI/CD-pipeline med GitHub Actions
- Förstå skillnaden mellan olika testtyper och när de används
