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

> **OBS:** Detta projekt innehåller endast ett litet urval av exempeltester för att demonstrera de olika testtyperna. Det är långt ifrån fullständig testtäckning - syftet är att visa hur man strukturerar och kör olika typer av tester.

Projektet demonstrerar tre typer av automatiserade tester:

### 1. Enhetstester (Unit Tests) - Vitest

**Vad är ett enhetstest?**
Ett enhetstest testar en enskild "enhet" av kod - typiskt en funktion eller en komponent - helt isolerat från resten av systemet. Man mockar (fejkar) beroenden som databaser, API-anrop etc. Enhetstester är snabba och körs utan webbläsare eller server.

**Våra exempeltester:**

| Testfil | Vad testas |
|---------|------------|
| `productPageHelpers.test.ts` | Funktionen `getHelpers()` som beräknar kategorier och sorteringsalternativ från en produktlista |
| `Select.test.tsx` | React-komponenten `Select` - att den renderar label, options och anropar callback vid ändring |

```bash
npm run test:run    # Kör en gång
npm run test        # Watch-läge (kör om vid ändringar)
npm run test:ui     # Grafiskt gränssnitt
```

---

### 2. E2E-tester (End-to-End) - Playwright

**Vad är ett E2E-test?**
Ett E2E-test testar hela applikationen "från ände till ände" - precis som en riktig användare. Playwright startar en riktig webbläsare, navigerar på sidan, klickar på knappar och verifierar att rätt saker visas. Dessa tester är långsammare men testar att alla delar fungerar tillsammans.

**Våra exempeltester:**

| Test | Vad testas |
|------|------------|
| "homepage loads and shows products heading" | Att startsidan laddar och visar rubriken "Our products" |
| "can navigate to About page" | Att man kan klicka på "About us" och komma till rätt sida |
| "products page has category filter" | Att kategori-dropdown visas på produktsidan |
| "products page has sort options" | Att sorterings-dropdown visas på produktsidan |

```bash
npm run test:e2e      # Kör mot produktionsbygge (port 5001)
npm run test:e2e:dev  # Kör mot utvecklingsserver (port 5173)
npm run test:e2e:ui   # Grafiskt gränssnitt
```

---

### 3. API-tester (Endpoint Tests) - Newman/Postman

**Vad är ett API-test?**
Ett API-test testar backend-API:et direkt genom att skicka HTTP-anrop och verifiera svaren - utan att gå via frontend. Detta testar att servern returnerar rätt data, statuskoder och format. Newman är kommandoradsverktyget för att köra Postman-kollektioner.

**Våra exempeltester:**

| Endpoint | Vad testas |
|----------|------------|
| `GET /api/products` | Returnerar 200, en array, och produkter har fälten id/name/price$ |
| `GET /api/products/1` | Returnerar 200 och produkten har id=1 |
| `GET /api/exchange-rates` | Returnerar 200 och svaret innehåller "usd" |
| `GET /api/cart` | Returnerar 200 och ett giltigt objekt |

```bash
# Starta servern först (i en terminal)
npm run backend

# Kör testerna (i en annan terminal)
npm run test:api
```

**Postman-import:** Filen `api-tests/collection.json` kan importeras i Postman (File → Import) för att köra testerna manuellt, inspektera API-svaren och lägga till fler tester.

---

## CI/CD med GitHub Actions

Filen `.github/workflows/test.yml` kör alla tester automatiskt vid varje push och pull request till main-branchen.

**Flödet:**

```
1. Checka ut kod
2. Installera Node.js 20 och npm-paket
3. Cacha Playwright-browsers (snabbare vid efterföljande körningar)
4. Bygg projektet (npm run build)
5. Kör enhetstester (npm run test:run)
6. Starta backend-servern
7. Kör E2E-tester (npm run test:e2e)
8. Kör API-tester (npm run test:api)
```

Vid misslyckade tester sparas Playwright-rapporten som en artifakt som kan laddas ner för felsökning.

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
├── api-tests/            # API-tester (Newman/Postman)
└── .github/workflows/    # CI/CD-pipeline
```

---

## Lärandemål

Efter att ha arbetat med detta projekt ska du kunna:

- Förklara skillnaden mellan enhets-, E2E- och API-tester
- Skriva och köra enhetstester med Vitest
- Skriva och köra E2E-tester med Playwright
- Skriva och köra API-tester med Newman/Postman
- Sätta upp en CI/CD-pipeline med GitHub Actions som kör alla testtyper automatiskt
